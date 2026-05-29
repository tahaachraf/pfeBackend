const Utilisateur = require("../models/utilisateurs.model");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const transporter = require("../config/mailer");
const speakeasy = require("speakeasy");
const QRCode = require("qrcode");

exports.getAll = async (req, res) => {
  try {
    const users = await Utilisateur.find().select("-motDePasse -verificationToken -twoFASecret");
    res.status(200).json(users);
  } catch (error) {
    console.error("Erreur getAll :", error);
    res.status(500).json({ error: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const user = await Utilisateur.findById(req.params.id).select("-motDePasse -verificationToken -twoFASecret");
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });
    res.status(200).json(user);
  } catch (error) {
    console.error("Erreur getById :", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * CREATE USER / RÉINSCRIPTION
 * - Email inconnu             → nouveau compte  (statut: enCours)
 * - Email existant + bloque   → réinitialisation (statut: enCours)
 * - Email existant + autre    → erreur 400
 */
exports.createUser = async (req, res) => {
  try {
    const { nom, prenom, email, motDePasse, password, role } = req.body;
    const mdp = motDePasse || password;

    if (!nom || !email || !mdp) {
      return res.status(400).json({ message: "Les champs nom, email et motDePasse sont obligatoires" });
    }

    const hashedPassword = await bcrypt.hash(mdp, 10);
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationTokenExpires = new Date(Date.now() + 1000 * 60 * 60); // 1 heure

    const exist = await Utilisateur.findOne({ email });

    if (exist) {
      // Compte bloqué → autoriser la réinscription
      if (exist.statut === "bloque") {
        exist.nom = nom;
        exist.prenom = prenom;
        exist.motDePasse = hashedPassword;
        exist.role = role || exist.role;
        exist.statut = "enCours";
        exist.verificationToken = verificationToken;
        exist.verificationTokenExpires = verificationTokenExpires;
        await exist.save();

        await sendVerificationEmail(email, prenom || nom, verificationToken);

        console.log(`🔄 Réinscription autorisée pour : ${email}`);
        return res.status(201).json({
          message: "Réinscription effectuée. Vérifiez votre email pour activer votre compte.",
          statut: "enCours"
        });
      }

      return res.status(400).json({ message: "Un compte avec cet email existe déjà" });
    }

    // Nouveau compte
    const newUser = new Utilisateur({
      nom, prenom, email,
      motDePasse: hashedPassword,
      role: role || "client",   // ✅ CORRIGÉ : "client" au lieu de "internaute"
      statut: "enCours",
      verificationToken,
      verificationTokenExpires
    });

    await newUser.save();
    await sendVerificationEmail(email, prenom || nom, verificationToken);

    res.status(201).json({
      message: "Compte créé avec succès. Vérifiez votre email pour activer votre compte.",
      statut: "enCours"
    });

  } catch (error) {
    console.error("Erreur createUser :", error);
    res.status(500).json({ error: error.message });
  }
};

// Helper : envoi de l'email de vérification
async function sendVerificationEmail(email, displayName, token) {
  const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 3500}`;
  const verificationLink = `${baseUrl}/api/verify/${token}`;

  try {
    await transporter.sendMail({
      from: `"${process.env.EMAIL_FROM_NAME || 'ShopTunisie'}" <${process.env.EMAIL}>`,
      to: email,
      subject: "Validation de votre compte",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #2563eb;">Bienvenue ${displayName} !</h2>
          <p>Votre compte est en cours de validation. Cliquez ci-dessous pour l'activer :</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationLink}"
               style="background-color: #2563eb; color: white; padding: 14px 28px;
                      text-decoration: none; border-radius: 6px; font-weight: bold;">
              Valider mon compte
            </a>
          </div>
          <p style="color: #888; font-size: 13px;">⏳ Ce lien expire dans 1 heure.</p>
          <p style="color: #888; font-size: 13px;">${verificationLink}</p>
        </div>
      `
    });
    console.log(`📧 Email envoyé à : ${email}`);
  } catch (emailError) {
    console.error("⚠️ Erreur envoi email (compte créé quand même) :", emailError.message);
  }
}

/**
 * VERIFY EMAIL
 * - statut : enCours → actif
 * - Génère un JWT pour connexion automatique
 * - Sauvegarde token + user dans localStorage
 * - Redirige vers le frontend
 */
exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await Utilisateur.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: new Date() }
    });

    if (!user) {
      return res.status(400).send(`
        <html>
          <head><meta charset="UTF-8"/><title>Lien expiré</title></head>
          <body style="font-family:Arial;display:flex;justify-content:center;align-items:center;min-height:100vh;margin:0;background:#f4f4f4">
            <div style="background:white;padding:40px;border-radius:16px;text-align:center;max-width:420px;width:90%;box-shadow:0 4px 24px rgba(0,0,0,0.08)">
              <div style="font-size:56px">❌</div>
              <h2 style="color:#dc2626;margin:16px 0 12px">Lien invalide ou expiré</h2>
              <p style="color:#555">Ce lien a expiré (durée : 1 heure).</p>
              <p style="color:#555;margin-top:8px">Veuillez vous <strong>réinscrire</strong> avec le même email.</p>
            </div>
          </body>
        </html>
      `);
    }

    user.statut = "actif";
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    console.log(`✅ Compte activé : ${user.email}`);

    // JWT pour connexion automatique (7 jours)
    const jwtSecret = process.env.JWT_SECRET || "jwt_secret_par_defaut";
    const authToken = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      jwtSecret,
      { expiresIn: "7d" }
    );

    const userData = {
      _id: user._id,
      nom: user.nom,
      prenom: user.prenom,
      email: user.email,
      role: user.role,
      statut: "actif"
    };

    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const accountPath = process.env.ACCOUNT_PATH || "/mon-compte";
    const redirectUrl = `${frontendUrl}${accountPath}?token=${authToken}&user=${encodeURIComponent(JSON.stringify(userData))}`;

    res.send(`
      <html>
        <head>
          <meta charset="UTF-8" />
          <title>Compte activé</title>
          <style>
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body {
              font-family: Arial, sans-serif;
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
              background: #f4f4f4;
            }
            .card {
              background: white;
              padding: 48px 40px;
              border-radius: 16px;
              text-align: center;
              max-width: 420px;
              width: 90%;
              box-shadow: 0 4px 24px rgba(0,0,0,0.08);
            }
            .icon { font-size: 56px; margin-bottom: 16px; }
            h2 { color: #16a34a; margin-bottom: 12px; font-size: 22px; }
            p { color: #555; margin-bottom: 8px; font-size: 15px; }
            .btn {
              display: inline-block;
              margin-top: 24px;
              background: #2563eb;
              color: white;
              padding: 13px 32px;
              border-radius: 8px;
              text-decoration: none;
              font-weight: bold;
              font-size: 15px;
            }
            .bar-wrap {
              margin-top: 20px;
              background: #e5e7eb;
              border-radius: 99px;
              height: 4px;
              overflow: hidden;
            }
            .bar {
              height: 4px;
              background: #16a34a;
              border-radius: 99px;
              animation: shrink 3s linear forwards;
            }
            @keyframes shrink { from { width: 100%; } to { width: 0%; } }
            .note { color: #aaa; font-size: 12px; margin-top: 14px; }
          </style>
          <script>
            // Connexion automatique : sauvegarde dans localStorage
            try {
              var authToken = "${authToken}";
              var userData = ${JSON.stringify(userData)};

              localStorage.setItem('token', authToken);
              localStorage.setItem('authToken', authToken);
              localStorage.setItem('user', JSON.stringify(userData));
              localStorage.setItem('userData', JSON.stringify(userData));
              localStorage.setItem('currentUser', JSON.stringify(userData));
            } catch(e) {
              console.error('Erreur localStorage :', e);
            }

            // Redirection automatique après 3 secondes
            setTimeout(function() {
              window.location.href = "${frontendUrl}${accountPath}";
            }, 3000);
          </script>
        </head>
        <body>
          <div class="card">
            <div class="icon">✅</div>
            <h2>Compte activé avec succès !</h2>
            <p>Bienvenue <strong>${user.prenom || ""} ${user.nom}</strong> !</p>
            <p>Connexion automatique dans 3 secondes...</p>
            <div class="bar-wrap"><div class="bar"></div></div>
            <a href="${frontendUrl}${accountPath}" class="btn">Accéder à mon compte</a>
            <p class="note">Si la redirection ne fonctionne pas, cliquez sur le bouton.</p>
          </div>
        </body>
      </html>
    `);

  } catch (error) {
    console.error("Erreur verifyEmail :", error);
    res.status(500).json({ error: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { nom, prenom, email, motDePasse, role, statut } = req.body;

    let updateData = { nom, prenom, email, role, statut };
    if (motDePasse) {
      updateData.motDePasse = await bcrypt.hash(motDePasse, 10);
    }

    const updatedUser = await Utilisateur.findByIdAndUpdate(id, updateData, { new: true, runValidators: true })
      .select("-motDePasse -verificationToken -twoFASecret");

    if (!updatedUser) return res.status(404).json({ message: "Utilisateur non trouvé" });

    res.status(200).json({ message: "Utilisateur modifié avec succès", utilisateur: updatedUser });
  } catch (error) {
    console.error("Erreur updateUser :", error);
    res.status(500).json({ error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await Utilisateur.findByIdAndDelete(id);
    if (!deletedUser) return res.status(404).json({ message: "Utilisateur non trouvé" });
    res.status(200).json({ message: "Utilisateur supprimé avec succès" });
  } catch (error) {
    console.error("Erreur deleteUser :", error);
    res.status(500).json({ error: error.message });
  }
};

exports.generate2FA = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await Utilisateur.findById(userId);
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

    const secret = speakeasy.generateSecret({ name: `TunisieShopping (${user.email})` });
    user.twoFASecret = secret.base32;
    await user.save();

    const qrCode = await QRCode.toDataURL(secret.otpauth_url);
    res.json({ qrCode });
  } catch (error) {
    console.error("Erreur generate2FA :", error);
    res.status(500).json({ error: error.message });
  }
};

exports.enable2FA = async (req, res) => {
  try {
    const { userId, token } = req.body;
    const user = await Utilisateur.findById(userId);

    const verified = speakeasy.totp.verify({ secret: user.twoFASecret, encoding: "base32", token, window: 1 });
    if (!verified) return res.status(400).json({ message: "Code invalide ❌" });

    user.twoFAEnabled = true;
    await user.save();
    res.json({ message: "2FA activé avec succès ✅" });
  } catch (error) {
    console.error("Erreur enable2FA :", error);
    res.status(500).json({ error: error.message });
  }
};

exports.verify2FA = async (req, res) => {
  try {
    const { userId, token } = req.body;
    const user = await Utilisateur.findById(userId);

    const verified = speakeasy.totp.verify({ secret: user.twoFASecret, encoding: "base32", token, window: 1 });
    if (!verified) return res.status(400).json({ message: "Code incorrect ❌" });

    res.json({ message: "Connexion validée ✅" });
  } catch (error) {
    console.error("Erreur verify2FA :", error);
    res.status(500).json({ error: error.message });
  }
};
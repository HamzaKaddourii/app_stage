<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Réinitialisation de mot de passe</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333333;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #ffffff;
            border-radius: 5px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            padding: 20px;
            background-color: #0d6efd;
            color: #ffffff;
            border-radius: 5px 5px 0 0;
        }
        .content {
            padding: 20px;
        }
        .button {
            display: inline-block;
            padding: 10px 20px;
            background-color: #0d6efd;
            color: #ffffff !important;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
            font-weight: bold;
        }
        .footer {
            text-align: center;
            padding: 20px;
            font-size: 12px;
            color: #777777;
        }
        a {
            color: #0d6efd;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Réinitialisation de mot de passe</h1>
        </div>
        <div class="content">
            <h2>Bonjour {{ $user->name }},</h2>
            <p>Vous recevez cet email car nous avons reçu une demande de réinitialisation de mot de passe pour votre compte.</p>
            <p>Pour réinitialiser votre mot de passe, veuillez cliquer sur le bouton ci-dessous :</p>
            
            <div style="text-align: center;">
                <a href="{{ $resetUrl }}" class="button">Réinitialiser mon mot de passe</a>
            </div>
            
            <p>Ce lien de réinitialisation de mot de passe expirera dans 24 heures.</p>
            <p>Si vous n'avez pas demandé de réinitialisation de mot de passe, aucune action n'est requise.</p>
            
            <p>Cordialement,<br>L'équipe InfoDesign</p>
        </div>
        <div class="footer">
            <p>&copy; {{ date('Y') }} InfoDesign. Tous droits réservés.</p>
            <p>
                Si vous avez des difficultés à cliquer sur le bouton "Réinitialiser mon mot de passe", copiez et collez l'URL ci-dessous dans votre navigateur web : 
                <br>
                <a href="{{ $resetUrl }}">{{ $resetUrl }}</a>
            </p>
        </div>
    </div>
</body>
</html>

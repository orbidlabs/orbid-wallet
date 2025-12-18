/**
 * Email translations for server-side email sending
 * These are separate from client-side translations to avoid importing React in server code
 */

export type SupportedLanguage = 'en' | 'es' | 'zh_CN' | 'hi' | 'pt' | 'fr' | 'de' | 'ja' | 'ko' | 'ar' | 'ca' | 'id' | 'ms' | 'pl' | 'es_419' | 'th' | 'zh_TW';

interface EmailTranslations {
    subject: string;
    title: string;
    subtitle: string;
    expiresIn: string;
    termsAgreement: string;
    securityWarning: string;
}

const emailTranslations: Record<SupportedLanguage, EmailTranslations> = {
    en: {
        subject: 'is your OrbId Wallet login code',
        title: 'Your Login Code',
        subtitle: 'Enter this code to sign in to OrbId Wallet',
        expiresIn: 'This code expires in 10 minutes',
        termsAgreement: 'By completing your login, you agree to our Terms of Service and Privacy Policy.',
        securityWarning: "If you didn't attempt to login but received this email, you can safely ignore it. No account will be logged in. Do not share or forward this 6-digit code with anyone. Our customer service team will never ask for this code. Do not read this code out loud. Be cautious of phishing attempts and always verify the sender and domain (orbidwallet.com) before acting. If you are concerned about your account's safety, please visit Help & Support in the mini app.",
    },
    es: {
        subject: 'es tu código de inicio de sesión de OrbId Wallet',
        title: 'Tu Código de Acceso',
        subtitle: 'Ingresa este código para iniciar sesión en OrbId Wallet',
        expiresIn: 'Este código expira en 10 minutos',
        termsAgreement: 'Al completar tu inicio de sesión, aceptas nuestros Términos de Servicio y Política de Privacidad.',
        securityWarning: 'Si no intentaste iniciar sesión pero recibiste este correo, puedes ignorarlo con seguridad. Ninguna cuenta será iniciada. No compartas ni reenvíes este código de 6 dígitos. Nuestro equipo de soporte nunca te pedirá este código. No leas este código en voz alta. Ten cuidado con intentos de phishing y verifica siempre el remitente y dominio (orbidwallet.com). Si te preocupa la seguridad de tu cuenta, visita Ayuda y Soporte en la mini app.',
    },
    zh_CN: {
        subject: '是您的 OrbId Wallet 登录验证码',
        title: '您的登录验证码',
        subtitle: '输入此验证码以登录 OrbId Wallet',
        expiresIn: '此验证码将在10分钟后过期',
        termsAgreement: '完成登录即表示您同意我们的服务条款和隐私政策。',
        securityWarning: '如果您没有尝试登录却收到此邮件，请放心忽略。不会有任何账户被登录。请勿与任何人分享或转发此6位验证码。我们的客服团队永远不会索要此验证码。请勿大声读出此验证码。请警惕钓鱼攻击，始终验证发件人和域名（orbidwallet.com）。如果您担心账户安全，请访问迷你应用中的帮助与支持。',
    },
    zh_TW: {
        subject: '是您的 OrbId Wallet 登入驗證碼',
        title: '您的登入驗證碼',
        subtitle: '輸入此驗證碼以登入 OrbId Wallet',
        expiresIn: '此驗證碼將在10分鐘後過期',
        termsAgreement: '完成登入即表示您同意我們的服務條款和隱私政策。',
        securityWarning: '如果您沒有嘗試登入卻收到此郵件，請放心忽略。不會有任何帳戶被登入。請勿與任何人分享或轉發此6位驗證碼。我們的客服團隊永遠不會索要此驗證碼。請勿大聲讀出此驗證碼。請警惕釣魚攻擊，始終驗證發件人和網域（orbidwallet.com）。如果您擔心帳戶安全，請訪問迷你應用中的幫助與支援。',
    },
    hi: {
        subject: 'आपका OrbId Wallet लॉगिन कोड है',
        title: 'आपका लॉगिन कोड',
        subtitle: 'OrbId Wallet में साइन इन करने के लिए यह कोड दर्ज करें',
        expiresIn: 'यह कोड 10 मिनट में समाप्त हो जाएगा',
        termsAgreement: 'लॉगिन पूरा करके, आप हमारी सेवा की शर्तों और गोपनीयता नीति से सहमत होते हैं।',
        securityWarning: 'यदि आपने लॉगिन का प्रयास नहीं किया लेकिन यह ईमेल प्राप्त हुआ, तो आप इसे सुरक्षित रूप से अनदेखा कर सकते हैं। कोई भी खाता लॉग इन नहीं होगा। इस 6-अंकीय कोड को किसी के साथ साझा या अग्रेषित न करें। हमारी ग्राहक सेवा टीम कभी भी यह कोड नहीं मांगेगी। इस कोड को जोर से न पढ़ें। फ़िशिंग प्रयासों से सावधान रहें और हमेशा प्रेषक और डोमेन (orbidwallet.com) सत्यापित करें। यदि आप अपने खाते की सुरक्षा को लेकर चिंतित हैं, तो मिनी ऐप में सहायता और समर्थन पर जाएं।',
    },
    pt: {
        subject: 'é o seu código de login do OrbId Wallet',
        title: 'Seu Código de Login',
        subtitle: 'Digite este código para entrar no OrbId Wallet',
        expiresIn: 'Este código expira em 10 minutos',
        termsAgreement: 'Ao completar seu login, você concorda com nossos Termos de Serviço e Política de Privacidade.',
        securityWarning: 'Se você não tentou fazer login mas recebeu este email, pode ignorá-lo com segurança. Nenhuma conta será logada. Não compartilhe ou encaminhe este código de 6 dígitos. Nossa equipe de atendimento nunca pedirá este código. Não leia este código em voz alta. Cuidado com tentativas de phishing e sempre verifique o remetente e domínio (orbidwallet.com). Se você está preocupado com a segurança da sua conta, visite Ajuda e Suporte no mini app.',
    },
    fr: {
        subject: "est votre code de connexion OrbId Wallet",
        title: 'Votre Code de Connexion',
        subtitle: 'Entrez ce code pour vous connecter à OrbId Wallet',
        expiresIn: 'Ce code expire dans 10 minutes',
        termsAgreement: 'En finalisant votre connexion, vous acceptez nos Conditions d\'Utilisation et notre Politique de Confidentialité.',
        securityWarning: 'Si vous n\'avez pas tenté de vous connecter mais avez reçu cet email, vous pouvez l\'ignorer en toute sécurité. Aucun compte ne sera connecté. Ne partagez ni ne transférez ce code à 6 chiffres. Notre service client ne vous demandera jamais ce code. Ne lisez pas ce code à haute voix. Méfiez-vous des tentatives de phishing et vérifiez toujours l\'expéditeur et le domaine (orbidwallet.com). Si vous êtes préoccupé par la sécurité de votre compte, visitez l\'Aide et Support dans la mini app.',
    },
    de: {
        subject: 'ist Ihr OrbId Wallet Anmeldecode',
        title: 'Ihr Anmeldecode',
        subtitle: 'Geben Sie diesen Code ein, um sich bei OrbId Wallet anzumelden',
        expiresIn: 'Dieser Code läuft in 10 Minuten ab',
        termsAgreement: 'Mit Abschluss Ihrer Anmeldung stimmen Sie unseren Nutzungsbedingungen und Datenschutzrichtlinien zu.',
        securityWarning: 'Wenn Sie keinen Anmeldeversuch unternommen haben, aber diese E-Mail erhalten haben, können Sie sie sicher ignorieren. Es wird kein Konto angemeldet. Teilen oder leiten Sie diesen 6-stelligen Code nicht weiter. Unser Kundenservice wird niemals nach diesem Code fragen. Lesen Sie diesen Code nicht laut vor. Seien Sie vorsichtig bei Phishing-Versuchen und überprüfen Sie immer den Absender und die Domain (orbidwallet.com). Wenn Sie um die Sicherheit Ihres Kontos besorgt sind, besuchen Sie Hilfe & Support in der Mini-App.',
    },
    ja: {
        subject: 'があなたのOrbId Walletログインコードです',
        title: 'ログインコード',
        subtitle: 'OrbId Walletにサインインするには、このコードを入力してください',
        expiresIn: 'このコードは10分後に期限切れになります',
        termsAgreement: 'ログインを完了することで、利用規約とプライバシーポリシーに同意したことになります。',
        securityWarning: 'ログインを試みていないのにこのメールを受け取った場合は、無視しても安全です。アカウントがログインされることはありません。この6桁のコードを誰にも共有または転送しないでください。カスタマーサービスがこのコードを尋ねることは絶対にありません。このコードを声に出して読まないでください。フィッシング詐欺に注意し、送信者とドメイン（orbidwallet.com）を常に確認してください。アカウントのセキュリティが心配な場合は、ミニアプリのヘルプ＆サポートをご覧ください。',
    },
    ko: {
        subject: '은(는) OrbId Wallet 로그인 코드입니다',
        title: '로그인 코드',
        subtitle: 'OrbId Wallet에 로그인하려면 이 코드를 입력하세요',
        expiresIn: '이 코드는 10분 후에 만료됩니다',
        termsAgreement: '로그인을 완료하면 서비스 약관 및 개인정보처리방침에 동의하는 것입니다.',
        securityWarning: '로그인을 시도하지 않았는데 이 이메일을 받으셨다면 무시해도 됩니다. 어떤 계정도 로그인되지 않습니다. 이 6자리 코드를 누구와도 공유하거나 전달하지 마세요. 고객 서비스 팀은 절대로 이 코드를 요청하지 않습니다. 이 코드를 큰 소리로 읽지 마세요. 피싱 시도에 주의하고 항상 발신자와 도메인(orbidwallet.com)을 확인하세요. 계정 보안이 걱정되시면 미니 앱의 도움말 및 지원을 방문하세요.',
    },
    ar: {
        subject: 'هو رمز تسجيل الدخول إلى OrbId Wallet',
        title: 'رمز تسجيل الدخول',
        subtitle: 'أدخل هذا الرمز لتسجيل الدخول إلى OrbId Wallet',
        expiresIn: 'ينتهي هذا الرمز خلال 10 دقائق',
        termsAgreement: 'من خلال إكمال تسجيل الدخول، فإنك توافق على شروط الخدمة وسياسة الخصوصية.',
        securityWarning: 'إذا لم تحاول تسجيل الدخول ولكنك تلقيت هذا البريد الإلكتروني، يمكنك تجاهله بأمان. لن يتم تسجيل الدخول إلى أي حساب. لا تشارك أو تعيد توجيه هذا الرمز المكون من 6 أرقام. لن يطلب فريق خدمة العملاء لدينا هذا الرمز أبداً. لا تقرأ هذا الرمز بصوت عالٍ. احذر من محاولات التصيد الاحتيالي وتحقق دائماً من المرسل والنطاق (orbidwallet.com). إذا كنت قلقاً بشأن أمان حسابك، يرجى زيارة المساعدة والدعم في التطبيق المصغر.',
    },
    ca: {
        subject: 'és el teu codi d\'inici de sessió d\'OrbId Wallet',
        title: 'El Teu Codi d\'Accés',
        subtitle: 'Introdueix aquest codi per iniciar sessió a OrbId Wallet',
        expiresIn: 'Aquest codi caduca en 10 minuts',
        termsAgreement: 'En completar el teu inici de sessió, acceptes els nostres Termes de Servei i Política de Privacitat.',
        securityWarning: 'Si no has intentat iniciar sessió però has rebut aquest correu, pots ignorar-lo de manera segura. Cap compte serà iniciat. No comparteixis ni reenviïs aquest codi de 6 dígits. El nostre equip de suport mai et demanarà aquest codi.',
    },
    id: {
        subject: 'adalah kode login OrbId Wallet Anda',
        title: 'Kode Login Anda',
        subtitle: 'Masukkan kode ini untuk masuk ke OrbId Wallet',
        expiresIn: 'Kode ini kedaluwarsa dalam 10 menit',
        termsAgreement: 'Dengan menyelesaikan login, Anda menyetujui Ketentuan Layanan dan Kebijakan Privasi kami.',
        securityWarning: 'Jika Anda tidak mencoba login tetapi menerima email ini, Anda dapat mengabaikannya dengan aman. Tidak ada akun yang akan login. Jangan bagikan atau teruskan kode 6 digit ini. Tim layanan pelanggan kami tidak akan pernah meminta kode ini.',
    },
    ms: {
        subject: 'adalah kod log masuk OrbId Wallet anda',
        title: 'Kod Log Masuk Anda',
        subtitle: 'Masukkan kod ini untuk log masuk ke OrbId Wallet',
        expiresIn: 'Kod ini tamat tempoh dalam 10 minit',
        termsAgreement: 'Dengan melengkapkan log masuk anda, anda bersetuju dengan Terma Perkhidmatan dan Dasar Privasi kami.',
        securityWarning: 'Jika anda tidak cuba log masuk tetapi menerima e-mel ini, anda boleh mengabaikannya dengan selamat. Tiada akaun akan dilog masuk. Jangan kongsi atau majukan kod 6 digit ini. Pasukan perkhidmatan pelanggan kami tidak akan meminta kod ini.',
    },
    pl: {
        subject: 'to Twój kod logowania OrbId Wallet',
        title: 'Twój Kod Logowania',
        subtitle: 'Wprowadź ten kod, aby zalogować się do OrbId Wallet',
        expiresIn: 'Ten kod wygasa za 10 minut',
        termsAgreement: 'Kończąc logowanie, akceptujesz nasze Warunki Usługi i Politykę Prywatności.',
        securityWarning: 'Jeśli nie próbowałeś się zalogować, ale otrzymałeś ten e-mail, możesz go bezpiecznie zignorować. Żadne konto nie zostanie zalogowane. Nie udostępniaj ani nie przekazuj dalej tego 6-cyfrowego kodu. Nasz zespół obsługi klienta nigdy nie poprosi o ten kod.',
    },
    es_419: {
        subject: 'es tu código de inicio de sesión de OrbId Wallet',
        title: 'Tu Código de Acceso',
        subtitle: 'Ingresa este código para iniciar sesión en OrbId Wallet',
        expiresIn: 'Este código expira en 10 minutos',
        termsAgreement: 'Al completar tu inicio de sesión, aceptas nuestros Términos de Servicio y Política de Privacidad.',
        securityWarning: 'Si no intentaste iniciar sesión pero recibiste este correo, puedes ignorarlo con seguridad. Ninguna cuenta será iniciada. No compartas ni reenvíes este código de 6 dígitos. Nuestro equipo de soporte nunca te pedirá este código.',
    },
    th: {
        subject: 'คือรหัสเข้าสู่ระบบ OrbId Wallet ของคุณ',
        title: 'รหัสเข้าสู่ระบบของคุณ',
        subtitle: 'ใส่รหัสนี้เพื่อเข้าสู่ระบบ OrbId Wallet',
        expiresIn: 'รหัสนี้จะหมดอายุใน 10 นาที',
        termsAgreement: 'เมื่อทำการเข้าสู่ระบบเสร็จสิ้น คุณยอมรับข้อกำหนดการใช้บริการและนโยบายความเป็นส่วนตัวของเรา',
        securityWarning: 'หากคุณไม่ได้พยายามเข้าสู่ระบบแต่ได้รับอีเมลนี้ คุณสามารถเพิกเฉยได้อย่างปลอดภัย จะไม่มีบัญชีใดถูกเข้าสู่ระบบ ห้ามแชร์หรือส่งต่อรหัส 6 หลักนี้ ทีมบริการลูกค้าของเราจะไม่ขอรหัสนี้',
    },
};

export function getEmailTranslations(lang: string): EmailTranslations {
    const supportedLang = (Object.keys(emailTranslations).includes(lang) ? lang : 'en') as SupportedLanguage;
    return emailTranslations[supportedLang];
}


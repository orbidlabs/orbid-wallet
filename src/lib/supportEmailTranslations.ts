/**
 * Support email translations for localized user notifications
 */

export type SupportedLanguage = 'en' | 'es' | 'zh_CN' | 'hi' | 'pt' | 'fr' | 'de' | 'ja' | 'ko' | 'ar' | 'ca' | 'id' | 'ms' | 'pl' | 'es_419' | 'th' | 'zh_TW';

interface SupportTranslations {
    confirmation: {
        subject: string;
        title: string;
        subtitle: string;
        ticketLabel: string;
        categoryLabel: string;
        responseTime: string;
        footer: string;
    };
    reply: {
        subject: string;
        title: string;
        subtitle: string;
        ticketLabel: string;
        messageLabel: string;
        attachmentsLabel: string;
        replyPrompt: string;
        footer: string;
    };
    resolved: {
        subject: string;
        title: string;
        subtitle: string;
        ticketLabel: string;
        responseLabel: string;
        noReply: string;
        attachmentsLabel: string;
        footer: string;
    };
    topics: Record<string, string>;
}

export const supportEmailTranslations: Record<SupportedLanguage, SupportTranslations> = {
    en: {
        confirmation: {
            subject: 'Ticket Received',
            title: 'Ticket Received',
            subtitle: "We've received your support request",
            ticketLabel: 'Ticket Number',
            categoryLabel: 'Category',
            responseTime: "We'll respond within 24-48 hours",
            footer: 'If you have more questions, reply to this email.'
        },
        reply: {
            subject: 'Re: Ticket Update',
            title: 'New Reply',
            subtitle: 'You have a new reply on your ticket',
            ticketLabel: 'Ticket',
            messageLabel: 'Message',
            attachmentsLabel: 'Attachments',
            replyPrompt: 'Reply to this email to continue the conversation.',
            footer: 'If you have more questions, reply to this email.'
        },
        resolved: {
            subject: 'Ticket Resolved',
            title: 'Ticket Resolved',
            subtitle: 'Your request has been addressed',
            ticketLabel: 'Ticket',
            responseLabel: 'Our response',
            noReply: 'Your issue has been resolved.',
            attachmentsLabel: 'Attachments',
            footer: 'If you still need help, just reply to this email.'
        },
        topics: { general: 'General Question', transactions: 'Transaction Issue', account: 'Account Help', security: 'Security', other: 'Other' }
    },
    es: {
        confirmation: {
            subject: 'Ticket Recibido',
            title: 'Ticket Recibido',
            subtitle: 'Hemos recibido tu solicitud de soporte',
            ticketLabel: 'Número de Ticket',
            categoryLabel: 'Categoría',
            responseTime: 'Te responderemos en 24-48 horas',
            footer: 'Si tienes más preguntas, responde a este email.'
        },
        reply: {
            subject: 'Re: Actualización de Ticket',
            title: 'Nueva Respuesta',
            subtitle: 'Tienes una nueva respuesta en tu ticket',
            ticketLabel: 'Ticket',
            messageLabel: 'Mensaje',
            attachmentsLabel: 'Archivos adjuntos',
            replyPrompt: 'Responde a este email para continuar la conversación.',
            footer: 'Si tienes más preguntas, responde a este email.'
        },
        resolved: {
            subject: 'Ticket Resuelto',
            title: 'Ticket Resuelto',
            subtitle: 'Tu solicitud ha sido atendida',
            ticketLabel: 'Ticket',
            responseLabel: 'Nuestra respuesta',
            noReply: 'Tu problema ha sido resuelto.',
            attachmentsLabel: 'Archivos adjuntos',
            footer: 'Si aún necesitas ayuda, responde a este email.'
        },
        topics: { general: 'Pregunta General', transactions: 'Problema de Transacción', account: 'Ayuda con Cuenta', security: 'Seguridad', other: 'Otro' }
    },
    es_419: {
        confirmation: {
            subject: 'Ticket Recibido',
            title: 'Ticket Recibido',
            subtitle: 'Recibimos tu solicitud de soporte',
            ticketLabel: 'Número de Ticket',
            categoryLabel: 'Categoría',
            responseTime: 'Te responderemos en 24-48 horas',
            footer: 'Si tienes más preguntas, responde a este correo.'
        },
        reply: {
            subject: 'Re: Actualización de Ticket',
            title: 'Nueva Respuesta',
            subtitle: 'Tienes una nueva respuesta en tu ticket',
            ticketLabel: 'Ticket',
            messageLabel: 'Mensaje',
            attachmentsLabel: 'Archivos adjuntos',
            replyPrompt: 'Responde a este correo para continuar la conversación.',
            footer: 'Si tienes más preguntas, responde a este correo.'
        },
        resolved: {
            subject: 'Ticket Resuelto',
            title: 'Ticket Resuelto',
            subtitle: 'Tu solicitud ha sido atendida',
            ticketLabel: 'Ticket',
            responseLabel: 'Nuestra respuesta',
            noReply: 'Tu problema ha sido resuelto.',
            attachmentsLabel: 'Archivos adjuntos',
            footer: 'Si aún necesitas ayuda, solo responde a este correo.'
        },
        topics: { general: 'Pregunta General', transactions: 'Problema de Transacción', account: 'Ayuda con Cuenta', security: 'Seguridad', other: 'Otro' }
    },
    pt: {
        confirmation: {
            subject: 'Ticket Recebido',
            title: 'Ticket Recebido',
            subtitle: 'Recebemos o seu pedido de suporte',
            ticketLabel: 'Número do Ticket',
            categoryLabel: 'Categoria',
            responseTime: 'Responderemos em 24-48 horas',
            footer: 'Se tiver mais perguntas, responda a este e-mail.'
        },
        reply: {
            subject: 'Re: Atualização de Ticket',
            title: 'Nova Resposta',
            subtitle: 'Você tem uma nova resposta em seu ticket',
            ticketLabel: 'Ticket',
            messageLabel: 'Mensagem',
            attachmentsLabel: 'Arquivos anexos',
            replyPrompt: 'Responda a este e-mail para continuar a conversa.',
            footer: 'Se tiver mais perguntas, responda a este e-mail.'
        },
        resolved: {
            subject: 'Ticket Resolvido',
            title: 'Ticket Resolvido',
            subtitle: 'O seu pedido foi processado',
            ticketLabel: 'Ticket',
            responseLabel: 'Nossa resposta',
            noReply: 'Seu problema foi resolvido.',
            attachmentsLabel: 'Arquivos anexos',
            footer: 'Se ainda precisar de ajuda, responda a este e-mail.'
        },
        topics: { general: 'Questão Geral', transactions: 'Problema de Transação', account: 'Ajuda com a Conta', security: 'Segurança', other: 'Outro' }
    },
    fr: {
        confirmation: {
            subject: 'Ticket Reçu',
            title: 'Ticket Reçu',
            subtitle: 'Nous avons reçu votre demande de support',
            ticketLabel: 'Numéro de Ticket',
            categoryLabel: 'Catégorie',
            responseTime: "Nous vous répondrons d'ici 24 à 48 heures",
            footer: 'Si vous avez d\'autres questions, répondez à cet e-mail.'
        },
        reply: {
            subject: 'Re: Mise à jour du Ticket',
            title: 'Nouvelle Réponse',
            subtitle: 'Vous avez une nouvelle réponse à votre ticket',
            ticketLabel: 'Ticket',
            messageLabel: 'Message',
            attachmentsLabel: 'Pièces jointes',
            replyPrompt: 'Répondez à cet e-mail pour continuer la conversation.',
            footer: 'Si vous avez d\'autres questions, répondez à cet e-mail.'
        },
        resolved: {
            subject: 'Ticket Résolu',
            title: 'Ticket Résolu',
            subtitle: 'Votre demande a été traitée',
            ticketLabel: 'Ticket',
            responseLabel: 'Notre réponse',
            noReply: 'Votre problème a été résolu.',
            attachmentsLabel: 'Pièces jointes',
            footer: 'Si vous avez encore besoin d\'aide, répondez à cet e-mail.'
        },
        topics: { general: 'Question Générale', transactions: 'Problème de Transaction', account: 'Aide au Compte', security: 'Sécurité', other: 'Autre' }
    },
    de: {
        confirmation: {
            subject: 'Ticket Erhalten',
            title: 'Ticket Erhalten',
            subtitle: 'Wir haben Ihre Support-Anfrage erhalten',
            ticketLabel: 'Ticket-Nummer',
            categoryLabel: 'Kategorie',
            responseTime: 'Wir werden innerhalb der nächsten 24-48 Stunden antworten',
            footer: 'Wenn Sie weitere Fragen haben, antworten Sie auf diese E-Mail.'
        },
        reply: {
            subject: 'Re: Ticket-Update',
            title: 'Neue Antwort',
            subtitle: 'Sie haben eine neue Antwort auf Ihr Ticket',
            ticketLabel: 'Ticket',
            messageLabel: 'Nachricht',
            attachmentsLabel: 'Anhänge',
            replyPrompt: 'Antworten Sie auf diese E-Mail, um das Gespräch fortzusetzen.',
            footer: 'Wenn Sie weitere Fragen haben, antworten Sie auf diese E-Mail.'
        },
        resolved: {
            subject: 'Ticket Gelöst',
            title: 'Ticket Gelöst',
            subtitle: 'Ihre Anfrage wurde bearbeitet',
            ticketLabel: 'Ticket',
            responseLabel: 'Unsere Antwort',
            noReply: 'Ihr Problem wurde gelöst.',
            attachmentsLabel: 'Anhänge',
            footer: 'Wenn Sie noch Hilfe benötigen, antworten Sie einfach auf diese E-Mail.'
        },
        topics: { general: 'Allgemeine Frage', transactions: 'Transaktionsproblem', account: 'Kontohilfe', security: 'Sicherheit', other: 'Sonstiges' }
    },
    zh_CN: {
        confirmation: {
            subject: '已收到您的工单',
            title: '工单已收到',
            subtitle: '我们已收到您的支持请求',
            ticketLabel: '工单编号',
            categoryLabel: '类别',
            responseTime: '我们将在 24-48 小时内回复',
            footer: '如果您还有其他问题，请回复此邮件。'
        },
        reply: {
            subject: '回复：工单更新',
            title: '新回复',
            subtitle: '您的工单有新的回复',
            ticketLabel: '工单',
            messageLabel: '消息',
            attachmentsLabel: '附件',
            replyPrompt: '回复此邮件以继续对话。',
            footer: '如果您还有其他问题，请回复此邮件。'
        },
        resolved: {
            subject: '工单已解决',
            title: '工单已解决',
            subtitle: '您的请求已得到处理',
            ticketLabel: '工单',
            responseLabel: '我们的回复',
            noReply: '您的问题已解决。',
            attachmentsLabel: '附件',
            footer: '如果您仍需要帮助，请回复此邮件。'
        },
        topics: { general: '一般问题', transactions: '交易问题', account: '账户帮助', security: '安全', other: '其他' }
    },
    zh_TW: {
        confirmation: {
            subject: '已收到您的工單',
            title: '工單已收到',
            subtitle: '我們已收到您的支援請求',
            ticketLabel: '工單編號',
            categoryLabel: '類別',
            responseTime: '我們將在 24-48 小時內回覆',
            footer: '如果您還有其他問題，請回覆此郵件。'
        },
        reply: {
            subject: '回覆：工單更新',
            title: '新回覆',
            subtitle: '您的工單有新的回覆',
            ticketLabel: '工單',
            messageLabel: '訊息',
            attachmentsLabel: '附件',
            replyPrompt: '回覆此郵件以繼續對話。',
            footer: '如果您還有其他問題，請回覆此郵件。'
        },
        resolved: {
            subject: '工單已解決',
            title: '工單已解決',
            subtitle: '您的請求已得到處理',
            ticketLabel: '工單',
            responseLabel: '我們的回覆',
            noReply: '您的問題已解決。',
            attachmentsLabel: '附件',
            footer: '如果您仍需要幫助，請回覆此郵件。'
        },
        topics: { general: '一般問題', transactions: '交易問題', account: '帳戶幫助', security: '安全', other: '其他' }
    },
    hi: {
        confirmation: {
            subject: 'टिकट प्राप्त हुआ',
            title: 'टिकट प्राप्त हुआ',
            subtitle: 'हमें आपका सहायता अनुरोध प्राप्त हुआ है',
            ticketLabel: 'टिकट संख्या',
            categoryLabel: 'श्रेणी',
            responseTime: 'हम 24-48 घंटों के भीतर उत्तर देंगे',
            footer: 'यदि आपके पास और प्रश्न हैं, तो इस ईमेल का उत्तर दें।'
        },
        reply: {
            subject: 'रे: टिकट अपडेट',
            title: 'नया उत्तर',
            subtitle: 'आपके टिकट पर एक नया उत्तर है',
            ticketLabel: 'टिकट',
            messageLabel: 'संदेश',
            attachmentsLabel: 'संलग्नक',
            replyPrompt: 'बातचीत जारी रखने के लिए इस ईमेल का उत्तर दें।',
            footer: 'यदि आपके पास और प्रश्न हैं, तो इस ईमेल का उत्तर दें।'
        },
        resolved: {
            subject: 'टिकट हल हो गया',
            title: 'टिकट हल हो गया',
            subtitle: 'आपकी प्रार्थना स्वीकार कर ली गई है',
            ticketLabel: 'टिकट',
            responseLabel: 'हमारा उत्तर',
            noReply: 'आपकी समस्या हल हो गई है।',
            attachmentsLabel: 'संलग्नक',
            footer: 'यदि आपको अभी भी सहायता की आवश्यकता है, तो बस इस ईमेल का उत्तर दें।'
        },
        topics: { general: 'सामान्य प्रश्न', transactions: 'लेनदेन की समस्या', account: 'खाता सहायता', security: 'सुरक्षा', other: 'अन्य' }
    },
    ja: {
        confirmation: {
            subject: 'チケットを受領しました',
            title: 'チケット受領',
            subtitle: 'サポートリクエストを受け取りました',
            ticketLabel: 'チケット番号',
            categoryLabel: 'カテゴリー',
            responseTime: '24〜48時間以内に回答いたします',
            footer: 'ご不明な点がございましたら、このメールに返信してください。'
        },
        reply: {
            subject: 'Re: チケットの更新',
            title: '新しい返信',
            subtitle: 'チケットに新しい返信があります',
            ticketLabel: 'チケット',
            messageLabel: 'メッセージ',
            attachmentsLabel: '添付ファイル',
            replyPrompt: 'このメールに返信して会話を続けてください。',
            footer: 'ご不明な点がございましたら、このメールに返信してください。'
        },
        resolved: {
            subject: 'チケット解決済み',
            title: 'チケット解決',
            subtitle: 'リクエストに対応いたしました',
            ticketLabel: 'チケット',
            responseLabel: '回答',
            noReply: '問題は解決されました。',
            attachmentsLabel: '添付ファイル',
            footer: '引き続きサポートが必要な場合は、このメールに返信してください。'
        },
        topics: { general: '一般的な質問', transactions: '取引の問題', account: 'アカウントのヘルプ', security: 'セキュリティ', other: 'その他' }
    },
    ko: {
        confirmation: {
            subject: '티켓이 접수되었습니다',
            title: '티켓 접수됨',
            subtitle: '지원 요청이 접수되었습니다',
            ticketLabel: '티켓 번호',
            categoryLabel: '카테고리',
            responseTime: '24~48시간 이내에 답변해 드리겠습니다',
            footer: '추가 질문이 있으시면 이 이메일에 답장해 주세요.'
        },
        reply: {
            subject: 'Re: 티켓 업데이트',
            title: '새로운 답변',
            subtitle: '티켓에 새로운 답변이 등록되었습니다',
            ticketLabel: '티켓',
            messageLabel: '메시지',
            attachmentsLabel: '첨부 파일',
            replyPrompt: '대화를 계속하려면 이 이메일에 답장해 주세요.',
            footer: '추가 질문이 있으시면 이 이메일에 답장해 주세요.'
        },
        resolved: {
            subject: '티켓 해결됨',
            title: '티켓 해결',
            subtitle: '요청이 처리되었습니다',
            ticketLabel: '티켓',
            responseLabel: '답변 내용',
            noReply: '문제가 해결되었습니다.',
            attachmentsLabel: '첨부 파일',
            footer: '도움이 더 필요하시면 이 이메일에 답장해 주세요.'
        },
        topics: { general: '일반 질문', transactions: '거래 문제', account: '계정 도움말', security: '보안', other: '기타' }
    },
    ar: {
        confirmation: {
            subject: 'تم استلام التذكرة',
            title: 'تم استلام التذكرة',
            subtitle: 'لقد استلمنا طلب الدعم الخاص بك',
            ticketLabel: 'رقم التذكرة',
            categoryLabel: 'الفئة',
            responseTime: 'سنقوم بالرد خلال 24-48 ساعة',
            footer: 'إذا كان لديك المزيد من الأسئلة، يرجى الرد على هذا البريد الإلكتروني.'
        },
        reply: {
            subject: 'رد: تحديث التذكرة',
            title: 'رد جديد',
            subtitle: 'لديك رد جديد على تذكرتك',
            ticketLabel: 'التذكرة',
            messageLabel: 'الرسالة',
            attachmentsLabel: 'المرفقات',
            replyPrompt: 'رد على هذا البريد الإلكتروني لمواصلة المحادثة.',
            footer: 'إذا كان لديك المزيد من الأسئلة، يرجى الرد على هذا البريد الإلكتروني.'
        },
        resolved: {
            subject: 'تم حل التذكرة',
            title: 'تم حل التذكرة',
            subtitle: 'تمت معالجة طلبك',
            ticketLabel: 'التذكرة',
            responseLabel: 'ردنا',
            noReply: 'تم حل مشكلتك.',
            attachmentsLabel: 'المرفقات',
            footer: 'إذا كنت لا تزال بحاجة إلى مساعدة، فما عليك سوى الرد على هذا البريد الإلكتروني.'
        },
        topics: { general: 'سؤال عام', transactions: 'مشكلة في المعاملة', account: 'مساعدة في الحساب', security: 'الأمان', other: 'آخر' }
    },
    ca: {
        confirmation: {
            subject: 'Ticket Rebut',
            title: 'Ticket Rebut',
            subtitle: 'Hem rebut la teva sol·licitud de suport',
            ticketLabel: 'Número de Ticket',
            categoryLabel: 'Categoria',
            responseTime: 'Et respondrem en 24-48 hores',
            footer: 'Si tens més preguntes, respon a aquest correu electrònic.'
        },
        reply: {
            subject: 'Re: Actualització de Ticket',
            title: 'Nova Resposta',
            subtitle: 'Tens una nova resposta al teu ticket',
            ticketLabel: 'Ticket',
            messageLabel: 'Missatge',
            attachmentsLabel: 'Fitxers adjunts',
            replyPrompt: 'Respon a aquest correu electrònic per continuar la conversa.',
            footer: 'Si tens més preguntes, respon a aquest correu electrònic.'
        },
        resolved: {
            subject: 'Ticket Resolt',
            title: 'Ticket Resolt',
            subtitle: 'La teva sol·licitud ha estat atesa',
            ticketLabel: 'Ticket',
            responseLabel: 'La nostra resposta',
            noReply: 'El teu problema s\'ha resolt.',
            attachmentsLabel: 'Fitxers adjunts',
            footer: 'Si encara necessites ajuda, respon a aquest correu electrònic.'
        },
        topics: { general: 'Pregunta General', transactions: 'Problema de Transacció', account: 'Ajuda amb el Compte', security: 'Seguretat', other: 'Altres' }
    },
    id: {
        confirmation: {
            subject: 'Tiket Diterima',
            title: 'Tiket Diterima',
            subtitle: 'Kami telah menerima permintaan bantuan Anda',
            ticketLabel: 'Nomor Tiket',
            categoryLabel: 'Kategori',
            responseTime: 'Kami akan menanggapi dalam 24-48 jam',
            footer: 'Jika Anda memiliki pertanyaan lebih lanjut, balas email ini.'
        },
        reply: {
            subject: 'Re: Pembaruan Tiket',
            title: 'Balasan Baru',
            subtitle: 'Anda memiliki balasan baru pada tiket Anda',
            ticketLabel: 'Tiket',
            messageLabel: 'Pesan',
            attachmentsLabel: 'Lampiran',
            replyPrompt: 'Balas email ini untuk melanjutkan percakapan.',
            footer: 'Jika Anda memiliki pertanyaan lebih lanjut, balas email ini.'
        },
        resolved: {
            subject: 'Tiket Selesai',
            title: 'Tiket Selesai',
            subtitle: 'Permintaan Anda telah ditangani',
            ticketLabel: 'Tiket',
            responseLabel: 'Tanggapan kami',
            noReply: 'Masalah Anda telah diselesaikan.',
            attachmentsLabel: 'Lampiran',
            footer: 'Jika Anda masih membutuhkan bantuan, cukup balas email ini.'
        },
        topics: { general: 'Pertanyaan Umum', transactions: 'Masalah Transaksi', account: 'Bantuan Akun', security: 'Keamanan', other: 'Lainnya' }
    },
    ms: {
        confirmation: {
            subject: 'Tiket Diterima',
            title: 'Tiket Diterima',
            subtitle: 'Kami telah menerima permintaan sokongan anda',
            ticketLabel: 'Nombor Tiket',
            categoryLabel: 'Kategori',
            responseTime: 'Kami akan menjawab dalam masa 24-48 jam',
            footer: 'Jika anda mempunyai soalan lanjut, balas e-mel ini.'
        },
        reply: {
            subject: 'Re: Kemas Kini Tiket',
            title: 'Balasan Baru',
            subtitle: 'Anda mempunyai balasan baru pada tiket anda',
            ticketLabel: 'Tiket',
            messageLabel: 'Mesej',
            attachmentsLabel: 'Lampiran',
            replyPrompt: 'Balas e-mel ini untuk meneruskan perbualan.',
            footer: 'Jika anda mempunyai soalan lanjut, balas e-mel ini.'
        },
        resolved: {
            subject: 'Tiket Selesai',
            title: 'Tiket Selesai',
            subtitle: 'Permintaan anda telah ditangani',
            ticketLabel: 'Tiket',
            responseLabel: 'Jawapan kami',
            noReply: 'Masalah anda telah diselesaikan.',
            attachmentsLabel: 'Lampiran',
            footer: 'Jika anda masih memerlukan bantuan, balas e-mel ini.'
        },
        topics: { general: 'Soalan Umum', transactions: 'Masalah Transaksi', account: 'Bantuan Akaun', security: 'Keselamatan', other: 'Lain-lain' }
    },
    pl: {
        confirmation: {
            subject: 'Zgłoszenie Otrzymane',
            title: 'Zgłoszenie Otrzymane',
            subtitle: 'Otrzymaliśmy Twoją prośbę o wsparcie',
            ticketLabel: 'Numer Zgłoszenia',
            categoryLabel: 'Kategoria',
            responseTime: 'Odpowiemy w ciągu 24-48 godzin',
            footer: 'Jeśli masz więcej pytań, odpowiedz na ten e-mail.'
        },
        reply: {
            subject: 'Re: Aktualizacja Zgłoszenia',
            title: 'Nowa Odpowiedź',
            subtitle: 'Masz nową odpowiedź w swoim zgłoszeniu',
            ticketLabel: 'Zgłoszenie',
            messageLabel: 'Wiadomość',
            attachmentsLabel: 'Załączniki',
            replyPrompt: 'Odpowiedz na ten e-mail, aby kontynuować rozmowę.',
            footer: 'Jeśli masz więcej pytań, odpowiedz na ten e-mail.'
        },
        resolved: {
            subject: 'Zgłoszenie Rozwiązane',
            title: 'Zgłoszenie Rozwiązane',
            subtitle: 'Twoja prośba została rozpatrzona',
            ticketLabel: 'Zgłoszenie',
            responseLabel: 'Nasza odpowiedź',
            noReply: 'Twój problem został rozwiązany.',
            attachmentsLabel: 'Załączniki',
            footer: 'Jeśli nadal potrzebujesz pomocy, odpowiedz na ten e-mail.'
        },
        topics: { general: 'Ogólne Pytanie', transactions: 'Problem z Transakcją', account: 'Pomoc z Kontem', security: 'Bezpieczeństwo', other: 'Inne' }
    },
    th: {
        confirmation: {
            subject: 'ได้รับบัตรสนเทศแล้ว',
            title: 'ได้รับบัตรสนเทศแล้ว',
            subtitle: 'เราได้รับคำขอรับการสนับสนุนของคุณแล้ว',
            ticketLabel: 'หมายเลขบัตร',
            categoryLabel: 'หมวดหมู่',
            responseTime: 'เราจะตอบกลับภายใน 24-48 ชั่วโมง',
            footer: 'หากคุณมีคำถามเพิ่มเติม โปรดตอบกลับอีเมลนี้'
        },
        reply: {
            subject: 'Re: อัปเดตบัตรสนเทศ',
            title: 'การตอบกลับใหม่',
            subtitle: 'คุณมีการตอบกลับใหม่ในบัตรสนเทศของคุณ',
            ticketLabel: 'บัตร',
            messageLabel: 'ข้อความ',
            attachmentsLabel: 'สิ่งที่แนบมา',
            replyPrompt: 'ตอบกลับอีเมลนี้เพื่อสนทนาต่อ',
            footer: 'หากคุณมีคำถามเพิ่มเติม โปรดตอบกลับอีเมลนี้'
        },
        resolved: {
            subject: 'บัตรสนเทศถูกแก้ไขแล้ว',
            title: 'บัตรสนเทศถูกแก้ไขแล้ว',
            subtitle: 'คำขอของคุณได้รับการดำเนินการแล้ว',
            ticketLabel: 'บัตร',
            responseLabel: 'การตอบกลับของเรา',
            noReply: 'ปัญหาของคุณได้รับการแก้ไขแล้ว',
            attachmentsLabel: 'สิ่งที่แนบมา',
            footer: 'หากคุณยังต้องการความช่วยเหลือ โปรดตอบกลับอีเมลนี้'
        },
        topics: { general: 'คำถามทั่วไป', transactions: 'ปัญหาการทำธุรกรรม', account: 'ช่วยเหลือเกี่ยวกับบัญชี', security: 'ความปลอดภัย', other: 'อื่นๆ' }
    }
};

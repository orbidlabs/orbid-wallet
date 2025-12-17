import { NextRequest, NextResponse } from 'next/server';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Lazy-init Supabase client
let _supabase: SupabaseClient | null = null;
function getSupabase(): SupabaseClient | null {
    if (!_supabase && process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
        _supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL,
            process.env.SUPABASE_SERVICE_ROLE_KEY
        );
    }
    return _supabase;
}

const ADMIN_SECRET = process.env.ADMIN_SECRET;

export interface HistoryEntry {
    type: 'user_message' | 'admin_reply' | 'status_change' | 'note';
    content: string;
    attachments?: string[];
    author?: string;
    timestamp: string;
}

export interface SupportTicket {
    id: string;
    ticket_id: string;
    email: string;
    topic: string;
    message: string;
    status: 'new' | 'in-progress' | 'resolved' | 'closed';
    priority: 'low' | 'medium' | 'high';
    wallet_address?: string;
    language: string;
    internal_notes?: string;
    admin_reply?: string;
    attachments?: string[];
    history?: HistoryEntry[];
    created_at: string;
    updated_at: string;
    resolved_at?: string;
}

/** Generate ticket ID */
function generateTicketId(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 6);
    return `TKT-${timestamp}-${random}`.toUpperCase();
}

/** Get language from Accept-Language header */
function getLanguage(request: NextRequest): string {
    const acceptLang = request.headers.get('Accept-Language') || 'en';
    return acceptLang.startsWith('es') ? 'es' : 'en';
}

/** Send confirmation email */
async function sendConfirmationEmail(email: string, ticketId: string, topic: string, lang: string) {
    const apiKey = process.env.BREVO_API_KEY;
    const senderEmail = process.env.BREVO_SENDER_EMAIL;
    if (!apiKey || !senderEmail) return;

    const t = lang === 'es' ? {
        title: '¡Recibimos tu mensaje!',
        subtitle: 'Te responderemos lo antes posible',
        ticketLabel: 'Tu número de ticket',
        categoryLabel: 'Categoría',
        nextSteps: 'Próximos pasos',
        step1: 'Revisaremos tu solicitud',
        step2: 'Te responderemos por email',
        step3: 'Guarda este número de ticket',
        timeframe: 'Tiempo estimado de respuesta: 24-48 horas',
        footer: 'OrbId Wallet • Soporte'
    } : {
        title: 'We got your message!',
        subtitle: "We'll get back to you as soon as possible",
        ticketLabel: 'Your ticket number',
        categoryLabel: 'Category',
        nextSteps: 'What happens next',
        step1: "We'll review your request",
        step2: "You'll receive a reply via email",
        step3: 'Keep this ticket number for reference',
        timeframe: 'Expected response time: 24-48 hours',
        footer: 'OrbId Wallet • Support'
    };

    const topicLabels: Record<string, Record<string, string>> = {
        en: { general: 'General Question', transactions: 'Transaction Issue', account: 'Account Help', security: 'Security', other: 'Other' },
        es: { general: 'Pregunta General', transactions: 'Transacciones', account: 'Cuenta', security: 'Seguridad', other: 'Otro' }
    };

    const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#000;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#000;padding:32px 16px;">
<tr><td align="center">
<table width="100%" style="max-width:480px;" cellpadding="0" cellspacing="0">
    <!-- Logo -->
    <tr><td style="padding-bottom:32px;text-align:center;">
        <img src="https://app.orbidwallet.com/logo.png" alt="OrbId" width="56" height="56" style="border-radius:16px;">
    </td></tr>
    
    <!-- Main Card -->
    <tr><td style="background:#111;border-radius:24px;padding:40px 32px;">
        <!-- Header -->
        <h1 style="margin:0 0 8px;color:#fff;font-size:28px;font-weight:700;text-align:center;">${t.title}</h1>
        <p style="margin:0 0 32px;color:#888;font-size:16px;text-align:center;">${t.subtitle}</p>
        
        <!-- Ticket ID Box -->
        <div style="background:#1a1a1a;border-radius:16px;padding:24px;margin-bottom:24px;text-align:center;border:1px solid #333;">
            <p style="margin:0 0 8px;color:#666;font-size:12px;text-transform:uppercase;letter-spacing:1px;">${t.ticketLabel}</p>
            <p style="margin:0;color:#fff;font-size:24px;font-weight:700;font-family:'SF Mono',Monaco,monospace;letter-spacing:2px;">${ticketId}</p>
        </div>
        
        <!-- Category -->
        <div style="background:#1a1a1a;border-radius:16px;padding:20px;margin-bottom:32px;border:1px solid #333;">
            <p style="margin:0 0 4px;color:#666;font-size:12px;text-transform:uppercase;letter-spacing:1px;">${t.categoryLabel}</p>
            <p style="margin:0;color:#fff;font-size:16px;">${topicLabels[lang][topic] || topic}</p>
        </div>
        
        <!-- Next Steps -->
        <p style="margin:0 0 16px;color:#fff;font-size:14px;font-weight:600;">${t.nextSteps}</p>
        <div style="margin-bottom:24px;">
            <div style="display:flex;align-items:center;margin-bottom:12px;">
                <span style="color:#ec4899;font-size:16px;margin-right:12px;">1.</span>
                <span style="color:#aaa;font-size:14px;">${t.step1}</span>
            </div>
            <div style="display:flex;align-items:center;margin-bottom:12px;">
                <span style="color:#ec4899;font-size:16px;margin-right:12px;">2.</span>
                <span style="color:#aaa;font-size:14px;">${t.step2}</span>
            </div>
            <div style="display:flex;align-items:center;">
                <span style="color:#ec4899;font-size:16px;margin-right:12px;">3.</span>
                <span style="color:#aaa;font-size:14px;">${t.step3}</span>
            </div>
        </div>
        
        <!-- Timeframe -->
        <p style="margin:0;padding:16px;background:linear-gradient(135deg,rgba(236,72,153,0.15),rgba(168,85,247,0.15));border-radius:12px;color:#f472b6;font-size:14px;text-align:center;">${t.timeframe}</p>
    </td></tr>
    
    <!-- Footer -->
    <tr><td style="padding-top:24px;text-align:center;">
        <p style="margin:0;color:#444;font-size:12px;">${t.footer}</p>
    </td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;

    try {
        await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: { 'accept': 'application/json', 'api-key': apiKey, 'content-type': 'application/json' },
            body: JSON.stringify({
                sender: { name: 'OrbId Wallet', email: senderEmail },
                to: [{ email }],
                subject: lang === 'es' ? `✅ Ticket ${ticketId} recibido` : `✅ Ticket ${ticketId} received`,
                htmlContent: html
            })
        });
    } catch (e) { console.error('Email error:', e); }
}

/** Send resolved email */
async function sendResolvedEmail(email: string, ticketId: string, adminReply: string | null, lang: string, attachmentUrls: string[] = []) {
    const apiKey = process.env.BREVO_API_KEY;
    const senderEmail = process.env.BREVO_SENDER_EMAIL;
    if (!apiKey || !senderEmail) return;

    const t = lang === 'es' ? {
        title: '¡Problema resuelto!',
        subtitle: 'Tu ticket ha sido atendido',
        ticketLabel: 'Ticket',
        responseLabel: 'Nuestra respuesta',
        noReply: 'Tu problema ha sido resuelto satisfactoriamente.',
        attachmentsLabel: 'Imágenes adjuntas',
        needHelp: '¿Aún necesitas ayuda?',
        reopen: 'Responde a este email para reabrir el ticket',
        agent: 'Thian',
        role: 'OrbId Labs Support',
        footer: 'OrbId Wallet • Soporte'
    } : {
        title: 'Issue resolved!',
        subtitle: 'Your ticket has been addressed',
        ticketLabel: 'Ticket',
        responseLabel: 'Our response',
        noReply: 'Your issue has been successfully resolved.',
        attachmentsLabel: 'Attached images',
        needHelp: 'Still need help?',
        reopen: 'Reply to this email to reopen the ticket',
        agent: 'Thian',
        role: 'OrbId Labs Support',
        footer: 'OrbId Wallet • Support'
    };

    // Build attachment images HTML
    const attachmentsHtml = attachmentUrls.length > 0 ? `
        <div style="margin-top:20px;">
            <p style="margin:0 0 12px;color:#666;font-size:12px;text-transform:uppercase;letter-spacing:1px;">📎 ${t.attachmentsLabel}</p>
            ${attachmentUrls.map(url => `<img src="${url}" alt="Attachment" style="max-width:100%;border-radius:12px;margin-bottom:12px;border:1px solid #333;">`).join('')}
        </div>` : '';

    const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#000;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#000;padding:32px 16px;">
<tr><td align="center">
<table width="100%" style="max-width:480px;" cellpadding="0" cellspacing="0">
    <!-- Logo -->
    <tr><td style="padding-bottom:32px;text-align:center;">
        <img src="https://app.orbidwallet.com/logo.png" alt="OrbId" width="56" height="56" style="border-radius:16px;">
    </td></tr>
    
    <!-- Main Card -->
    <tr><td style="background:#111;border-radius:24px;padding:40px 32px;">
        <!-- Success Badge -->
        <div style="text-align:center;margin-bottom:24px;">
            <span style="display:inline-block;background:#10b981;color:#fff;font-size:32px;width:64px;height:64px;line-height:64px;border-radius:50%;">✓</span>
        </div>
        
        <!-- Header -->
        <h1 style="margin:0 0 8px;color:#fff;font-size:28px;font-weight:700;text-align:center;">${t.title}</h1>
        <p style="margin:0 0 32px;color:#888;font-size:16px;text-align:center;">${t.subtitle}</p>
        
        <!-- Ticket ID -->
        <p style="margin:0 0 24px;color:#666;font-size:13px;text-align:center;">${t.ticketLabel} <span style="color:#fff;font-family:'SF Mono',Monaco,monospace;">${ticketId}</span></p>
        
        <!-- Response Box -->
        <div style="background:#1a1a1a;border-radius:16px;padding:24px;margin-bottom:24px;border:1px solid #333;">
            <p style="margin:0 0 12px;color:#10b981;font-size:12px;text-transform:uppercase;letter-spacing:1px;font-weight:600;">${t.responseLabel}</p>
            <p style="margin:0;color:#e5e5e5;font-size:15px;line-height:1.6;">${adminReply || t.noReply}</p>
            ${attachmentsHtml}
        </div>
        
        <!-- Agent Signature -->
        <div style="display:flex;align-items:center;margin-bottom:24px;">
            <div style="width:40px;height:40px;background:linear-gradient(135deg,#ec4899,#8b5cf6);border-radius:50%;margin-right:12px;display:flex;align-items:center;justify-content:center;">
                <span style="color:#fff;font-size:16px;font-weight:700;">${t.agent.charAt(0)}</span>
            </div>
            <div>
                <p style="margin:0;color:#fff;font-size:14px;font-weight:600;">${t.agent}</p>
                <p style="margin:0;color:#666;font-size:12px;">${t.role}</p>
            </div>
        </div>
        
        <!-- Reopen Option -->
        <div style="background:rgba(236,72,153,0.1);border-radius:12px;padding:16px;text-align:center;border:1px solid rgba(236,72,153,0.2);">
            <p style="margin:0 0 4px;color:#fff;font-size:13px;font-weight:500;">${t.needHelp}</p>
            <p style="margin:0;color:#888;font-size:12px;">${t.reopen}</p>
        </div>
    </td></tr>
    
    <!-- Footer -->
    <tr><td style="padding-top:24px;text-align:center;">
        <p style="margin:0;color:#444;font-size:12px;">${t.footer}</p>
    </td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;

    try {
        await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: { 'accept': 'application/json', 'api-key': apiKey, 'content-type': 'application/json' },
            body: JSON.stringify({
                sender: { name: 'OrbId Wallet', email: senderEmail },
                to: [{ email }],
                subject: lang === 'es' ? `✅ Ticket ${ticketId} resuelto` : `✅ Ticket ${ticketId} resolved`,
                htmlContent: html
            })
        });
    } catch (e) { console.error('Email error:', e); }
}

/** Send reply email (for in-progress tickets) */
async function sendReplyEmail(email: string, ticketId: string, replyMessage: string, lang: string, attachmentUrls: string[] = []) {
    const apiKey = process.env.BREVO_API_KEY;
    const senderEmail = process.env.BREVO_SENDER_EMAIL;
    if (!apiKey || !senderEmail) return;

    const t = lang === 'es' ? {
        title: 'Tienes una respuesta',
        subtitle: 'Nuestro equipo ha respondido a tu ticket',
        ticketLabel: 'Ticket',
        messageLabel: 'Mensaje',
        attachmentsLabel: 'Imágenes adjuntas',
        replyPrompt: 'Responde a este email para continuar la conversación',
        agent: 'Thian',
        role: 'OrbId Labs Support',
        footer: 'OrbId Wallet • Soporte'
    } : {
        title: 'You have a reply',
        subtitle: 'Our team has responded to your ticket',
        ticketLabel: 'Ticket',
        messageLabel: 'Message',
        attachmentsLabel: 'Attached images',
        replyPrompt: 'Reply to this email to continue the conversation',
        agent: 'Thian',
        role: 'OrbId Labs Support',
        footer: 'OrbId Wallet • Support'
    };

    // Build attachment images HTML
    const attachmentsHtml = attachmentUrls.length > 0 ? `
        <div style="margin-top:20px;">
            <p style="margin:0 0 12px;color:#666;font-size:12px;text-transform:uppercase;letter-spacing:1px;">📎 ${t.attachmentsLabel}</p>
            ${attachmentUrls.map(url => `<img src="${url}" alt="Attachment" style="max-width:100%;border-radius:12px;margin-bottom:12px;border:1px solid #333;">`).join('')}
        </div>` : '';

    const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#000;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#000;padding:32px 16px;">
<tr><td align="center">
<table width="100%" style="max-width:480px;" cellpadding="0" cellspacing="0">
    <!-- Logo -->
    <tr><td style="padding-bottom:32px;text-align:center;">
        <img src="https://app.orbidwallet.com/logo.png" alt="OrbId" width="56" height="56" style="border-radius:16px;">
    </td></tr>
    
    <!-- Main Card -->
    <tr><td style="background:#111;border-radius:24px;padding:40px 32px;">
        <!-- Reply Badge -->
        <div style="text-align:center;margin-bottom:24px;">
            <span style="display:inline-block;background:#f59e0b;color:#000;font-size:24px;width:56px;height:56px;line-height:56px;border-radius:50%;">💬</span>
        </div>
        
        <!-- Header -->
        <h1 style="margin:0 0 8px;color:#fff;font-size:28px;font-weight:700;text-align:center;">${t.title}</h1>
        <p style="margin:0 0 32px;color:#888;font-size:16px;text-align:center;">${t.subtitle}</p>
        
        <!-- Ticket ID -->
        <p style="margin:0 0 24px;color:#666;font-size:13px;text-align:center;">${t.ticketLabel} <span style="color:#fff;font-family:'SF Mono',Monaco,monospace;">${ticketId}</span></p>
        
        <!-- Message Box -->
        <div style="background:#1a1a1a;border-radius:16px;padding:24px;margin-bottom:24px;border:1px solid #333;">
            <p style="margin:0 0 12px;color:#f59e0b;font-size:12px;text-transform:uppercase;letter-spacing:1px;font-weight:600;">${t.messageLabel}</p>
            <p style="margin:0;color:#e5e5e5;font-size:15px;line-height:1.6;white-space:pre-wrap;">${replyMessage}</p>
            ${attachmentsHtml}
        </div>
        
        <!-- Agent Signature -->
        <div style="display:flex;align-items:center;margin-bottom:24px;">
            <div style="width:40px;height:40px;background:linear-gradient(135deg,#f59e0b,#ec4899);border-radius:50%;margin-right:12px;display:flex;align-items:center;justify-content:center;">
                <span style="color:#fff;font-size:16px;font-weight:700;">${t.agent.charAt(0)}</span>
            </div>
            <div>
                <p style="margin:0;color:#fff;font-size:14px;font-weight:600;">${t.agent}</p>
                <p style="margin:0;color:#666;font-size:12px;">${t.role}</p>
            </div>
        </div>
        
        <!-- Reply Prompt -->
        <div style="background:rgba(245,158,11,0.1);border-radius:12px;padding:16px;text-align:center;border:1px solid rgba(245,158,11,0.2);">
            <p style="margin:0;color:#f59e0b;font-size:13px;">${t.replyPrompt}</p>
        </div>
    </td></tr>
    
    <!-- Footer -->
    <tr><td style="padding-top:24px;text-align:center;">
        <p style="margin:0;color:#444;font-size:12px;">${t.footer}</p>
    </td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;

    try {
        await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: { 'accept': 'application/json', 'api-key': apiKey, 'content-type': 'application/json' },
            body: JSON.stringify({
                sender: { name: 'OrbId Wallet', email: senderEmail },
                to: [{ email }],
                subject: lang === 'es' ? `💬 Respuesta a tu ticket ${ticketId}` : `💬 Reply to your ticket ${ticketId}`,
                htmlContent: html
            })
        });
    } catch (e) { console.error('Email error:', e); }
}


/** POST - Create ticket */
export async function POST(request: NextRequest) {
    try {
        const db = getSupabase();
        if (!db) {
            return NextResponse.json({ error: 'Database unavailable' }, { status: 503 });
        }

        const body = await request.json();
        const { email, topic, message, walletAddress, priority = 'medium', attachments = [] } = body;

        if (!email || !topic || !message) {
            return NextResponse.json({ error: 'Email, topic, and message required' }, { status: 400 });
        }

        const lang = getLanguage(request);
        const ticketId = generateTicketId();

        // Initialize history with user's first message
        const initialHistory: HistoryEntry[] = [{
            type: 'user_message',
            content: message,
            attachments: attachments.length > 0 ? attachments : undefined,
            author: email,
            timestamp: new Date().toISOString()
        }];

        const { error } = await db.from('support_tickets').insert({
            ticket_id: ticketId,
            email,
            topic,
            message,
            priority,
            wallet_address: walletAddress,
            language: lang,
            attachments: attachments,
            history: initialHistory
        });

        if (error) {
            console.error('Supabase error:', error);
            return NextResponse.json({ error: 'Failed to create ticket' }, { status: 500 });
        }

        await sendConfirmationEmail(email, ticketId, topic, lang);

        return NextResponse.json({ success: true, ticketId });
    } catch (e) {
        console.error('Error:', e);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}

/** GET - List tickets (admin) */
export async function GET(request: NextRequest) {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');
    if (token !== ADMIN_SECRET) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = getSupabase();
    if (!db) {
        return NextResponse.json({ error: 'Database unavailable' }, { status: 503 });
    }

    const { data, error } = await db
        .from('support_tickets')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
    }

    return NextResponse.json({ tickets: data || [] });
}

/** PATCH - Update ticket (admin) */
export async function PATCH(request: NextRequest) {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');
    if (token !== ADMIN_SECRET) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = getSupabase();
    if (!db) {
        return NextResponse.json({ error: 'Database unavailable' }, { status: 503 });
    }

    try {
        const { ticketId, status, priority, internal_notes, admin_reply, action, attachmentUrls = [] } = await request.json();

        if (!ticketId) {
            return NextResponse.json({ error: 'Ticket ID required' }, { status: 400 });
        }

        // Get current ticket for email and history
        const { data: current } = await db
            .from('support_tickets')
            .select('email, language, status, history')
            .eq('ticket_id', ticketId)
            .single();

        const updates: Record<string, unknown> = {};
        if (status) updates.status = status;
        if (priority) updates.priority = priority;
        if (internal_notes !== undefined) updates.internal_notes = internal_notes;
        if (admin_reply !== undefined) updates.admin_reply = admin_reply;

        // Append to history for reply/resolve actions
        const currentHistory: HistoryEntry[] = current?.history || [];

        if (action === 'reply' && admin_reply) {
            // Reply action: set to in-progress and append to history
            updates.status = 'in-progress';
            currentHistory.push({
                type: 'admin_reply',
                content: admin_reply,
                attachments: attachmentUrls.length > 0 ? attachmentUrls : undefined,
                author: 'Thian from OrbId Labs',
                timestamp: new Date().toISOString()
            });
            updates.history = currentHistory;
        } else if (action === 'resolve') {
            // Resolve action: set to resolved and append final message
            updates.status = 'resolved';
            updates.resolved_at = new Date().toISOString();
            if (admin_reply) {
                currentHistory.push({
                    type: 'admin_reply',
                    content: admin_reply,
                    attachments: attachmentUrls.length > 0 ? attachmentUrls : undefined,
                    author: 'Thian from OrbId Labs',
                    timestamp: new Date().toISOString()
                });
            }
            currentHistory.push({
                type: 'status_change',
                content: 'Ticket marked as resolved',
                author: 'System',
                timestamp: new Date().toISOString()
            });
            updates.history = currentHistory;
        } else if (status === 'resolved' || status === 'closed') {
            updates.resolved_at = new Date().toISOString();
        }

        const { data, error } = await db
            .from('support_tickets')
            .update(updates)
            .eq('ticket_id', ticketId)
            .select()
            .single();

        if (error) {
            return NextResponse.json({ error: 'Update failed' }, { status: 500 });
        }

        // Send emails based on action (with embedded images)
        if (current?.email) {
            if (action === 'reply' && admin_reply) {
                await sendReplyEmail(current.email, ticketId, admin_reply, current.language || 'en', attachmentUrls);
            } else if (action === 'resolve') {
                await sendResolvedEmail(current.email, ticketId, admin_reply, current.language || 'en', attachmentUrls);
            }
        }

        return NextResponse.json({ success: true, ticket: data });
    } catch (e) {
        console.error('Error:', e);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}

/** DELETE - Delete ticket (admin) */
export async function DELETE(request: NextRequest) {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');
    if (token !== ADMIN_SECRET) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = getSupabase();
    if (!db) {
        return NextResponse.json({ error: 'Database unavailable' }, { status: 503 });
    }

    const ticketId = new URL(request.url).searchParams.get('id');
    if (!ticketId) {
        return NextResponse.json({ error: 'Ticket ID required' }, { status: 400 });
    }

    const { error } = await db
        .from('support_tickets')
        .delete()
        .eq('ticket_id', ticketId);

    if (error) {
        return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
}

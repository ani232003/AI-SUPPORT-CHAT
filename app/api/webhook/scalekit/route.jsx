import { ca } from "date-fns/locale";

export async function POST(req) {
    try {
        const body = await req.text();

        const headers = Object.fromEntries(req.headers.entries());

        const secret = process.env.SCALEKIT_WEBHOOK_SECRET;

        try {
            scalekit.verifyWebhookPayload(scalekit,headers, body)

        } catch (error) {
            console.error('Invalid webhook signature:', error);
            return new Response('Invalid signature', { status: 401 });
        }

        const event = JSON.parse(body);

        switch (event.type) {
            case 'user.organization_membership_created':
                const param = event.data;
                await db .update(teamMembers)
                .set({status: 'active',})
                .where(eq(teamMembers.user_email, param.user.email));
                break;
            default:
                console.log('Unhandled event type:', event.type);
        }

        return new Response('Webhook received', { status: 200 });

    } catch (error) {
        console.error('Error processing webhook:', error);
        return new Response('Internal Server Error', { status: 500 });
    }
}
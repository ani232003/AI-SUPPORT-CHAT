

export async function POST(request){
    try{
        const user = await isAuthorized();
        if (!user) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
        }
        const { color, welcome_message } = await request.json();
        const body = await request.json();

        if(!color || !welcome_message){
            return new Response(JSON.stringify({ error: 'Color and Welcome Message are required' }), { status: 400 })
        }

        const [updatedMetadata] = await db.update(chatBotMetaData)
            .set({
                color,
                welcome_message
            })
            .where(eq(chatBotMetaData.user_email, user.email))
            .returning();

        return new Response(JSON.stringify({ data: updatedMetadata }), { status: 200 })

    } catch (error) {
        console.error('Error in POST /api/chatbot/metadata/update:', error)
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 })

    }
}
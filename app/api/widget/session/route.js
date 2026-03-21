import { NextResponse } from 'next/server'

export async function POST(request) {
    try {
        const { widgetId } = await request.json();
        if (!widgetId) {
            return NextResponse.json({ success: false, error: 'widgetId is required' }, { status: 400 });
        }
        return NextResponse.json({ success: true, sessionId: widgetId }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import connectToDatabase from '@/lib/mongoose';
import UserProgress from '@/models/UserProgress';

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    await connectToDatabase();
    let progress = await UserProgress.findOne({ userId });

    if (!progress) {
      return NextResponse.json({ message: 'No progress found' }, { status: 404 });
    }

    return NextResponse.json(progress);
  } catch (error) {
    console.error('[PROGRESS_GET]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    const { completedProblems, bookmarkedProblems, notes, dailySolves, activeDays, stats } = body;

    await connectToDatabase();

    const progress = await UserProgress.findOneAndUpdate(
      { userId },
      {
        completedProblems,
        bookmarkedProblems,
        notes,
        dailySolves,
        activeDays,
        stats
      },
      { new: true, upsert: true }
    );

    return NextResponse.json(progress);
  } catch (error) {
    console.error('[PROGRESS_POST]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

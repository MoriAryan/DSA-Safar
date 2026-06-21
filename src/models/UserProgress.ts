import mongoose, { Schema, Document } from 'mongoose';

export interface IUserProgress extends Document {
  userId: string;
  completedProblems: Record<string, any>;
  bookmarkedProblems: Record<string, boolean>;
  notes: Record<string, string>;
  dailySolves: Record<string, number>;
  stats: {
    dailyTarget: number;
    longestStreak: number;
    lastActiveDate: string | null;
  };
}

const UserProgressSchema: Schema = new Schema({
  userId: { type: String, required: true, unique: true },
  completedProblems: { type: Map, of: Schema.Types.Mixed, default: {} },
  bookmarkedProblems: { type: Map, of: Boolean, default: {} },
  notes: { type: Map, of: String, default: {} },
  dailySolves: { type: Map, of: Number, default: {} },
  stats: {
    dailyTarget: { type: Number, default: 3 },
    longestStreak: { type: Number, default: 0 },
    lastActiveDate: { type: String, default: null },
  }
}, { timestamps: true });

export default mongoose.models.UserProgress || mongoose.model<IUserProgress>('UserProgress', UserProgressSchema);

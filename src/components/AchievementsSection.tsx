import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Lock, Trophy } from "lucide-react";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  points: number;
  unlocked: boolean;
  unlockedAt?: string;
  progress?: number;
  requirement?: number;
}

export function AchievementsSection() {
  // Mock achievements data
  const achievements: Achievement[] = [
    {
      id: "1",
      title: "First Steps",
      description: "Complete your first quiz",
      icon: "🎯",
      points: 10,
      unlocked: true,
      unlockedAt: "2024-01-15",
      progress: 1,
      requirement: 1,
    },
    {
      id: "2",
      title: "Quiz Enthusiast",
      description: "Complete 10 quizzes",
      icon: "📚",
      points: 50,
      unlocked: true,
      unlockedAt: "2024-01-20",
      progress: 10,
      requirement: 10,
    },
    {
      id: "3",
      title: "Quiz Master",
      description: "Complete 50 quizzes",
      icon: "🏆",
      points: 200,
      unlocked: false,
      progress: 15,
      requirement: 50,
    },
    {
      id: "4",
      title: "Perfect Score",
      description: "Get 100% on any quiz",
      icon: "⭐",
      points: 100,
      unlocked: true,
      unlockedAt: "2024-01-18",
      progress: 1,
      requirement: 1,
    },
    {
      id: "5",
      title: "Speed Demon",
      description: "Complete a quiz in under 5 minutes",
      icon: "⚡",
      points: 75,
      unlocked: false,
      progress: 0,
      requirement: 1,
    },
    {
      id: "6",
      title: "Top Scorer",
      description: "Reach top 10 on leaderboard",
      icon: "👑",
      points: 150,
      unlocked: false,
      progress: 0,
      requirement: 1,
    },
  ];

  const totalPoints = achievements
    .filter((a) => a.unlocked)
    .reduce((sum, a) => sum + a.points, 0);

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Achievements
              </CardTitle>
              <CardDescription>
                {unlockedCount} of {achievements.length} unlocked
              </CardDescription>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">{totalPoints}</div>
              <div className="text-sm text-muted-foreground">Total Points</div>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {achievements.map((achievement) => (
          <Card
            key={achievement.id}
            className={achievement.unlocked ? "border-primary/50" : "opacity-75"}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex gap-3">
                  <div className="text-4xl">{achievement.icon}</div>
                  <div>
                    <CardTitle className="text-lg">{achievement.title}</CardTitle>
                    <CardDescription>{achievement.description}</CardDescription>
                  </div>
                </div>
                {achievement.unlocked ? (
                  <Badge variant="default" className="gap-1">
                    <Trophy className="h-3 w-3" />
                    {achievement.points}
                  </Badge>
                ) : (
                  <Lock className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
            </CardHeader>
            <CardContent>
              {!achievement.unlocked && achievement.progress !== undefined && achievement.requirement ? (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">
                      {achievement.progress} / {achievement.requirement}
                    </span>
                  </div>
                  <Progress
                    value={(achievement.progress / achievement.requirement) * 100}
                  />
                </div>
              ) : achievement.unlocked && achievement.unlockedAt ? (
                <p className="text-sm text-muted-foreground">
                  Unlocked on {new Date(achievement.unlockedAt).toLocaleDateString()}
                </p>
              ) : null}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

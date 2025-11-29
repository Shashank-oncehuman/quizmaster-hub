import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Users, Trophy, Bell, Shield } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function AdminPanel() {
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  // Mock data
  const users = [
    { id: "1", name: "John Doe", email: "john@example.com", role: "user", quizzes: 15, score: 1250 },
    { id: "2", name: "Jane Smith", email: "jane@example.com", role: "admin", quizzes: 42, score: 3850 },
    { id: "3", name: "Bob Wilson", email: "bob@example.com", role: "moderator", quizzes: 28, score: 2340 },
  ];

  const achievements = [
    { id: "1", title: "First Steps", icon: "🎯", unlocked: 156 },
    { id: "2", title: "Quiz Enthusiast", icon: "📚", unlocked: 89 },
    { id: "3", title: "Perfect Score", icon: "⭐", unlocked: 34 },
  ];

  const handleRoleChange = (userId: string, newRole: string) => {
    toast({
      title: "Role Updated",
      description: `User role changed to ${newRole}`,
    });
  };

  const handleSendNotification = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Notification Sent",
      description: "The notification has been sent to all users",
    });
  };

  const handleCreateAchievement = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Achievement Created",
      description: "New achievement has been created successfully",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Shield className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold">Admin Management Panel</h1>
        </div>

        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="users">
              <Users className="h-4 w-4 mr-2" />
              Users
            </TabsTrigger>
            <TabsTrigger value="achievements">
              <Trophy className="h-4 w-4 mr-2" />
              Achievements
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Manage user roles and permissions</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Quizzes</TableHead>
                      <TableHead>Score</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>{user.quizzes}</TableCell>
                        <TableCell>{user.score}</TableCell>
                        <TableCell>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" onClick={() => setSelectedUser(user.id)}>
                                Edit Role
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Change User Role</DialogTitle>
                                <DialogDescription>
                                  Update the role for {user.name}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                  <Label>Role</Label>
                                  <Select defaultValue={user.role} onValueChange={(value) => handleRoleChange(user.id, value)}>
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="user">User</SelectItem>
                                      <SelectItem value="moderator">Moderator</SelectItem>
                                      <SelectItem value="admin">Admin</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                              <DialogFooter>
                                <Button type="button">Save Changes</Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Achievement Management</CardTitle>
                    <CardDescription>Create and manage achievements</CardDescription>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>Create Achievement</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create New Achievement</DialogTitle>
                        <DialogDescription>Add a new achievement for users to unlock</DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleCreateAchievement}>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="title">Title</Label>
                            <Input id="title" placeholder="Achievement title" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea id="description" placeholder="What does this achievement represent?" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="icon">Icon (Emoji)</Label>
                            <Input id="icon" placeholder="🏆" maxLength={2} />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="requirement">Requirement Type</Label>
                              <Select>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="quizzes_completed">Quizzes Completed</SelectItem>
                                  <SelectItem value="perfect_score">Perfect Score</SelectItem>
                                  <SelectItem value="speed_completion">Speed Completion</SelectItem>
                                  <SelectItem value="leaderboard_rank">Leaderboard Rank</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="value">Required Value</Label>
                              <Input id="value" type="number" placeholder="10" />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="points">Points</Label>
                            <Input id="points" type="number" placeholder="50" />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button type="submit">Create Achievement</Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {achievements.map((achievement) => (
                    <Card key={achievement.id}>
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <span className="text-4xl">{achievement.icon}</span>
                          <div>
                            <CardTitle className="text-lg">{achievement.title}</CardTitle>
                            <CardDescription>{achievement.unlocked} users unlocked</CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Send Notification</CardTitle>
                <CardDescription>Broadcast a notification to all users</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSendNotification} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="notif-title">Title</Label>
                    <Input id="notif-title" placeholder="Notification title" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notif-message">Message</Label>
                    <Textarea id="notif-message" placeholder="Notification message" rows={4} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notif-type">Type</Label>
                    <Select defaultValue="info">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="info">Info</SelectItem>
                        <SelectItem value="success">Success</SelectItem>
                        <SelectItem value="warning">Warning</SelectItem>
                        <SelectItem value="error">Error</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button type="submit">Send Notification</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

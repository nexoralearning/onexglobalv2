import { useState, useEffect } from "react";
import { useRequireAuth } from "@/hooks/use-require-auth";
import { User, saveUser, logout } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTheme } from "next-themes";
import { User as UserIcon, Bell, Palette, Globe, Shield, AlertTriangle } from "lucide-react";
import { useLocation } from "wouter";

export default function Settings() {
  const user = useRequireAuth();
  const { theme, setTheme } = useTheme();
  const [, setLocation] = useLocation();
  const [profileData, setProfileData] = useState<User | null>(null);

  useEffect(() => {
    if (user) setProfileData({ ...user });
  }, [user]);

  if (!user || !profileData) return null;

  const handleProfileSave = () => {
    saveUser(profileData);
    alert("Profile updated successfully!");
  };

  const handleLogoutAll = () => {
    logout();
    setLocation("/login");
  };

  const handleDeleteAccount = () => {
    if (confirm("Are you absolutely sure? This cannot be undone.")) {
      logout();
      setLocation("/signup");
      // real app: delete from backend/localstorage entirely
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your account preferences and profile details.
        </p>
      </div>

      <Tabs defaultValue="profile" className="flex flex-col md:flex-row gap-8">
        <TabsList className="flex md:flex-col h-auto bg-transparent gap-2 justify-start items-start w-full md:w-48 shrink-0 overflow-x-auto p-0">
          <TabsTrigger value="profile" className="w-full justify-start data-[state=active]:bg-sidebar data-[state=active]:shadow-none h-10 px-4">
            <UserIcon className="w-4 h-4 mr-2" /> Profile
          </TabsTrigger>
          <TabsTrigger value="appearance" className="w-full justify-start data-[state=active]:bg-sidebar data-[state=active]:shadow-none h-10 px-4">
            <Palette className="w-4 h-4 mr-2" /> Appearance
          </TabsTrigger>
          <TabsTrigger value="notifications" className="w-full justify-start data-[state=active]:bg-sidebar data-[state=active]:shadow-none h-10 px-4">
            <Bell className="w-4 h-4 mr-2" /> Notifications
          </TabsTrigger>
          <TabsTrigger value="language" className="w-full justify-start data-[state=active]:bg-sidebar data-[state=active]:shadow-none h-10 px-4">
            <Globe className="w-4 h-4 mr-2" /> Language
          </TabsTrigger>
          <TabsTrigger value="account" className="w-full justify-start data-[state=active]:bg-sidebar data-[state=active]:shadow-none h-10 px-4">
            <Shield className="w-4 h-4 mr-2" /> Account
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 min-w-0">
          <TabsContent value="profile" className="mt-0 space-y-6 animate-in fade-in-50">
            <Card>
              <CardHeader>
                <CardTitle>Public Profile</CardTitle>
                <CardDescription>This is how others will see you on the platform.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-6">
                  <Avatar className="w-24 h-24 border-2 border-border">
                    <AvatarImage src={profileData.avatarUrl} />
                    <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                      {profileData.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <Button variant="outline">Change Avatar</Button>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Full Name</Label>
                    <Input value={profileData.name} onChange={e => setProfileData({...profileData, name: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input value={profileData.email} disabled className="bg-muted" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Bio</Label>
                  <Textarea 
                    placeholder="Tell us a bit about yourself..." 
                    value={profileData.bio || ""}
                    onChange={e => setProfileData({...profileData, bio: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>University</Label>
                    <Input value={profileData.university} onChange={e => setProfileData({...profileData, university: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Degree / Major</Label>
                    <Input value={profileData.degree} onChange={e => setProfileData({...profileData, degree: e.target.value})} />
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-border">
                  <Button onClick={handleProfileSave}>Save Profile</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appearance" className="mt-0 space-y-6 animate-in fade-in-50">
            <Card>
              <CardHeader>
                <CardTitle>Theme</CardTitle>
                <CardDescription>Customize the look and feel of your workspace.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {/* Light */}
                  <button
                    onClick={() => setTheme("light")}
                    className={`border-2 rounded-xl p-2 transition-all ${theme === 'light' ? 'border-primary' : 'border-transparent hover:border-border'}`}
                    style={{ background: "#f8fafc" }}
                  >
                    <div className="w-full h-20 rounded-md border shadow-sm flex flex-col p-2 gap-2" style={{ background: "#ffffff", borderColor: "#e2e8f0" }}>
                      <div className="w-full h-2 rounded-sm" style={{ background: "#e2e8f0" }}></div>
                      <div className="w-1/2 h-2 rounded-sm" style={{ background: "#e2e8f0" }}></div>
                      <div className="mt-auto w-8 h-2 rounded-sm" style={{ background: "#3b82f6" }}></div>
                    </div>
                    <div className="text-sm font-medium mt-2 text-center" style={{ color: "#0f172a" }}>Light</div>
                  </button>

                  {/* Dark */}
                  <button
                    onClick={() => setTheme("dark")}
                    className={`border-2 rounded-xl p-2 transition-all ${theme === 'dark' ? 'border-primary' : 'border-transparent hover:border-border'}`}
                    style={{ background: "#0d1117" }}
                  >
                    <div className="w-full h-20 rounded-md border flex flex-col p-2 gap-2" style={{ background: "#060a12", borderColor: "#1e2533" }}>
                      <div className="w-full h-2 rounded-sm" style={{ background: "#1e2533" }}></div>
                      <div className="w-1/2 h-2 rounded-sm" style={{ background: "#1e2533" }}></div>
                      <div className="mt-auto w-8 h-2 rounded-sm" style={{ background: "#6674f4" }}></div>
                    </div>
                    <div className="text-sm font-medium mt-2 text-center" style={{ color: "#e2e8f0" }}>Dark</div>
                  </button>

                  {/* Purple & Black */}
                  <button
                    onClick={() => setTheme("purple-black")}
                    className={`border-2 rounded-xl p-2 transition-all ${theme === 'purple-black' ? 'border-[#a855f7]' : 'border-transparent hover:border-border'}`}
                    style={{ background: "#0d0515" }}
                  >
                    <div className="w-full h-20 rounded-md border flex flex-col p-2 gap-2" style={{ background: "#08030e", borderColor: "#2d1650" }}>
                      <div className="w-full h-2 rounded-sm" style={{ background: "#2d1650" }}></div>
                      <div className="w-1/2 h-2 rounded-sm" style={{ background: "#2d1650" }}></div>
                      <div className="mt-auto w-8 h-2 rounded-sm" style={{ background: "#a855f7" }}></div>
                    </div>
                    <div className="text-sm font-medium mt-2 text-center" style={{ color: "#e9d5ff" }}>Purple</div>
                  </button>

                  {/* Red & Black */}
                  <button
                    onClick={() => setTheme("red-black")}
                    className={`border-2 rounded-xl p-2 transition-all ${theme === 'red-black' ? 'border-[#ef4444]' : 'border-transparent hover:border-border'}`}
                    style={{ background: "#0d0303" }}
                  >
                    <div className="w-full h-20 rounded-md border flex flex-col p-2 gap-2" style={{ background: "#080202", borderColor: "#3d0f0f" }}>
                      <div className="w-full h-2 rounded-sm" style={{ background: "#3d0f0f" }}></div>
                      <div className="w-1/2 h-2 rounded-sm" style={{ background: "#3d0f0f" }}></div>
                      <div className="mt-auto w-8 h-2 rounded-sm" style={{ background: "#ef4444" }}></div>
                    </div>
                    <div className="text-sm font-medium mt-2 text-center" style={{ color: "#fecaca" }}>Red</div>
                  </button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="mt-0 space-y-6 animate-in fade-in-50">
            <Card>
              <CardHeader>
                <CardTitle>Email Notifications</CardTitle>
                <CardDescription>Choose what updates you want to receive.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {['Assignment Reminders', 'New Study Group Messages', 'Marketplace Activity', 'Weekly Digest'].map((item) => (
                  <div key={item} className="flex items-center justify-between py-3 border-b last:border-0 border-border">
                    <div className="space-y-0.5">
                      <Label className="text-base font-medium">{item}</Label>
                      <p className="text-sm text-muted-foreground">Receive emails about {item.toLowerCase()}.</p>
                    </div>
                    {/* Visual toggle */}
                    <div className="w-11 h-6 bg-primary rounded-full relative cursor-pointer opacity-80">
                      <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1 shadow-sm"></div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="language" className="mt-0 space-y-6 animate-in fade-in-50">
            <Card>
              <CardHeader>
                <CardTitle>Regional Settings</CardTitle>
                <CardDescription>Set your preferred language for the interface.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-w-sm">
                  <div className="space-y-2">
                    <Label>Language</Label>
                    <Select defaultValue="en">
                      <option value="en">English (US)</option>
                      <option value="fr">Français</option>
                      <option value="de">Deutsch</option>
                      <option value="hi">Hindi</option>
                      <option value="zh">Chinese</option>
                    </Select>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Note: Changing the language requires a page reload. Some user-generated content will remain in its original language.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="account" className="mt-0 space-y-6 animate-in fade-in-50">
            <Card>
              <CardHeader>
                <CardTitle>Security</CardTitle>
                <CardDescription>Manage your password and active sessions.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 max-w-md">
                  <div className="space-y-2">
                    <Label>Current Password</Label>
                    <Input type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label>New Password</Label>
                    <Input type="password" />
                  </div>
                  <Button className="w-fit">Update Password</Button>
                </div>
                
                <div className="pt-6 mt-6 border-t border-border">
                  <h4 className="text-sm font-semibold mb-2">Sessions</h4>
                  <p className="text-sm text-muted-foreground mb-4">Log out of all other active sessions on other devices.</p>
                  <Button variant="secondary" onClick={handleLogoutAll}>Log out of all devices</Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-destructive/20 bg-destructive/5">
              <CardHeader>
                <CardTitle className="text-destructive flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" /> Danger Zone
                </CardTitle>
                <CardDescription>Permanently delete your account and all associated data.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="destructive" onClick={handleDeleteAccount}>Delete Account</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}

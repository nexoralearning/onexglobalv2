import { useState, useEffect } from "react";
import { useRequireAuth } from "@/hooks/use-require-auth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getStorage, setStorage } from "@/lib/storage";
import { 
  Briefcase, GraduationCap, Award, FileText, Plus, Trash2, 
  Download, Printer, Copy, Check, Sparkles, User, Mail, Phone, MapPin, Globe, Linkedin, Github 
} from "lucide-react";
import { motion } from "framer-motion";

interface EducationItem {
  id: string;
  school: string;
  degree: string;
  year: string;
  grade: string;
}

interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string;
}

interface ProjectItem {
  id: string;
  title: string;
  tech: string;
  description: string;
}

interface CVData {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  linkedin: string;
  github: string;
  summary: string;
  education: EducationItem[];
  experience: ExperienceItem[];
  projects: ProjectItem[];
  skills: string[];
}

export default function CvBuilderPage() {
  const user = useRequireAuth();
  const [copied, setCopied] = useState(false);
  const [template, setTemplate] = useState<"modern" | "clean" | "executive">("modern");
  const [newSkill, setNewSkill] = useState("");

  const [cvData, setCvData] = useState<CVData>(() => {
    return getStorage<CVData>("unihub_cv_data", {
      fullName: user?.name || "Alex Morgan",
      email: user?.email || "alex.morgan@university.edu",
      phone: "+44 7700 900077",
      location: "London, UK",
      website: "alexmorgan.dev",
      linkedin: "linkedin.com/in/alexmorgan",
      github: "github.com/alexmorgan",
      summary: "Motivated computer science student with strong foundations in full-stack development, algorithms, and software engineering. Passionate about building accessible, scalable web solutions and collaborating on impactful tech projects.",
      education: [
        {
          id: "1",
          school: user?.university || "University of Oxford",
          degree: user?.degree || "BSc Computer Science",
          year: `2024 - 2027 (Year ${user?.year || 2})`,
          grade: "First Class Honours (Tracked)",
        },
      ],
      experience: [
        {
          id: "e1",
          role: "Software Engineering Intern",
          company: "Tech Startups UK",
          period: "Jun 2025 - Aug 2025",
          description: "Developed modern RESTful API endpoints and improved frontend load times by 35%. Collaborated with cross-functional teams using Agile methodology.",
        },
      ],
      projects: [
        {
          id: "p1",
          title: "UniHub Student Productivity Suite",
          tech: "React, TypeScript, Tailwind CSS",
          description: "Built a complete student workspace featuring assignment tracking, study group management, and interactive resource hubs.",
        },
      ],
      skills: ["React", "TypeScript", "Node.js", "Python", "Git & GitHub", "Tailwind CSS", "REST APIs", "SQL"],
    });
  });

  useEffect(() => {
    setStorage("unihub_cv_data", cvData);
  }, [cvData]);

  if (!user) return null;

  const handleAddEducation = () => {
    const newItem: EducationItem = {
      id: Date.now().toString(),
      school: "",
      degree: "",
      year: "",
      grade: "",
    };
    setCvData(prev => ({ ...prev, education: [...prev.education, newItem] }));
  };

  const handleRemoveEducation = (id: string) => {
    setCvData(prev => ({ ...prev, education: prev.education.filter(e => e.id !== id) }));
  };

  const handleAddExperience = () => {
    const newItem: ExperienceItem = {
      id: Date.now().toString(),
      role: "",
      company: "",
      period: "",
      description: "",
    };
    setCvData(prev => ({ ...prev, experience: [...prev.experience, newItem] }));
  };

  const handleRemoveExperience = (id: string) => {
    setCvData(prev => ({ ...prev, experience: prev.experience.filter(e => e.id !== id) }));
  };

  const handleAddProject = () => {
    const newItem: ProjectItem = {
      id: Date.now().toString(),
      title: "",
      tech: "",
      description: "",
    };
    setCvData(prev => ({ ...prev, projects: [...prev.projects, newItem] }));
  };

  const handleRemoveProject = (id: string) => {
    setCvData(prev => ({ ...prev, projects: prev.projects.filter(p => p.id !== id) }));
  };

  const handleAddSkill = () => {
    if (!newSkill.trim()) return;
    if (!cvData.skills.includes(newSkill.trim())) {
      setCvData(prev => ({ ...prev, skills: [...prev.skills, newSkill.trim()] }));
    }
    setNewSkill("");
  };

  const handleRemoveSkill = (skill: string) => {
    setCvData(prev => ({ ...prev, skills: prev.skills.filter(s => s !== skill) }));
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyMarkdown = () => {
    const markdown = `# ${cvData.fullName}
${cvData.email} | ${cvData.phone} | ${cvData.location}
${cvData.linkedin ? `LinkedIn: ${cvData.linkedin}` : ""} | ${cvData.github ? `GitHub: ${cvData.github}` : ""}

## Professional Summary
${cvData.summary}

## Education
${cvData.education.map(e => `### ${e.degree} - ${e.school} (${e.year})\n${e.grade ? `*Grade: ${e.grade}*\n` : ""}`).join("\n")}

## Work Experience
${cvData.experience.map(e => `### ${e.role} @ ${e.company} (${e.period})\n${e.description}\n`).join("\n")}

## Projects
${cvData.projects.map(p => `### ${p.title} (${p.tech})\n${p.description}\n`).join("\n")}

## Skills
${cvData.skills.join(", ")}
`;

    navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Student CV Builder</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Create, customize, and export your professional academic resume.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleCopyMarkdown} className="gap-2">
            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
            {copied ? "Copied Markdown" : "Copy Markdown"}
          </Button>
          <Button size="sm" onClick={handlePrint} className="gap-2 bg-primary">
            <Printer className="w-4 h-4" />
            Print / Save PDF
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Editor Form */}
        <div className="lg:col-span-6 space-y-6">
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="grid grid-cols-4 w-full bg-sidebar">
              <TabsTrigger value="personal" className="text-xs py-2">Personal</TabsTrigger>
              <TabsTrigger value="education" className="text-xs py-2">Education</TabsTrigger>
              <TabsTrigger value="experience" className="text-xs py-2">Work</TabsTrigger>
              <TabsTrigger value="skills" className="text-xs py-2">Skills & Projects</TabsTrigger>
            </TabsList>

            {/* Personal Details */}
            <TabsContent value="personal" className="mt-4 space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Personal Details</CardTitle>
                  <CardDescription>Your contact information displayed at the top of your CV</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold mb-1 block">Full Name</label>
                      <Input 
                        value={cvData.fullName} 
                        onChange={e => setCvData({ ...cvData, fullName: e.target.value })} 
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold mb-1 block">Email</label>
                      <Input 
                        value={cvData.email} 
                        onChange={e => setCvData({ ...cvData, email: e.target.value })} 
                        placeholder="john@university.edu"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold mb-1 block">Phone</label>
                      <Input 
                        value={cvData.phone} 
                        onChange={e => setCvData({ ...cvData, phone: e.target.value })} 
                        placeholder="+44 7123 456789"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold mb-1 block">Location</label>
                      <Input 
                        value={cvData.location} 
                        onChange={e => setCvData({ ...cvData, location: e.target.value })} 
                        placeholder="London, UK"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs font-semibold mb-1 block">Website</label>
                      <Input 
                        value={cvData.website} 
                        onChange={e => setCvData({ ...cvData, website: e.target.value })} 
                        placeholder="portfolio.com"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold mb-1 block">LinkedIn</label>
                      <Input 
                        value={cvData.linkedin} 
                        onChange={e => setCvData({ ...cvData, linkedin: e.target.value })} 
                        placeholder="linkedin.com/in/user"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold mb-1 block">GitHub</label>
                      <Input 
                        value={cvData.github} 
                        onChange={e => setCvData({ ...cvData, github: e.target.value })} 
                        placeholder="github.com/user"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold mb-1 block">Professional Summary</label>
                    <Textarea 
                      rows={4}
                      value={cvData.summary} 
                      onChange={e => setCvData({ ...cvData, summary: e.target.value })} 
                      placeholder="Brief personal profile highlighting key achievements and degree focus..."
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Education */}
            <TabsContent value="education" className="mt-4 space-y-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-3">
                  <div>
                    <CardTitle className="text-base">Education History</CardTitle>
                    <CardDescription>University, degree, modules, and achievements</CardDescription>
                  </div>
                  <Button size="sm" variant="outline" onClick={handleAddEducation} className="gap-1 text-xs">
                    <Plus className="w-3.5 h-3.5" /> Add School
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {cvData.education.map((edu, idx) => (
                    <div key={edu.id} className="p-3 border rounded-lg space-y-3 bg-sidebar/50 relative group">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold uppercase text-muted-foreground">Education #{idx + 1}</span>
                        {cvData.education.length > 1 && (
                          <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => handleRemoveEducation(edu.id)}>
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <Input 
                          placeholder="Institution / University" 
                          value={edu.school} 
                          onChange={e => {
                            const updated = [...cvData.education];
                            updated[idx].school = e.target.value;
                            setCvData({ ...cvData, education: updated });
                          }}
                        />
                        <Input 
                          placeholder="Degree / Course" 
                          value={edu.degree} 
                          onChange={e => {
                            const updated = [...cvData.education];
                            updated[idx].degree = e.target.value;
                            setCvData({ ...cvData, education: updated });
                          }}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <Input 
                          placeholder="Years (e.g. 2024 - 2027)" 
                          value={edu.year} 
                          onChange={e => {
                            const updated = [...cvData.education];
                            updated[idx].year = e.target.value;
                            setCvData({ ...cvData, education: updated });
                          }}
                        />
                        <Input 
                          placeholder="Grade / Classification" 
                          value={edu.grade} 
                          onChange={e => {
                            const updated = [...cvData.education];
                            updated[idx].grade = e.target.value;
                            setCvData({ ...cvData, education: updated });
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Experience */}
            <TabsContent value="experience" className="mt-4 space-y-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-3">
                  <div>
                    <CardTitle className="text-base">Work & Internships</CardTitle>
                    <CardDescription>Relevant roles, part-time jobs, and responsibilities</CardDescription>
                  </div>
                  <Button size="sm" variant="outline" onClick={handleAddExperience} className="gap-1 text-xs">
                    <Plus className="w-3.5 h-3.5" /> Add Role
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {cvData.experience.map((exp, idx) => (
                    <div key={exp.id} className="p-3 border rounded-lg space-y-3 bg-sidebar/50">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold uppercase text-muted-foreground">Position #{idx + 1}</span>
                        {cvData.experience.length > 0 && (
                          <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => handleRemoveExperience(exp.id)}>
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <Input 
                          placeholder="Job Title / Role" 
                          value={exp.role} 
                          onChange={e => {
                            const updated = [...cvData.experience];
                            updated[idx].role = e.target.value;
                            setCvData({ ...cvData, experience: updated });
                          }}
                        />
                        <Input 
                          placeholder="Company / Organization" 
                          value={exp.company} 
                          onChange={e => {
                            const updated = [...cvData.experience];
                            updated[idx].company = e.target.value;
                            setCvData({ ...cvData, experience: updated });
                          }}
                        />
                      </div>
                      <Input 
                        placeholder="Period (e.g. Jun 2025 - Present)" 
                        value={exp.period} 
                        onChange={e => {
                          const updated = [...cvData.experience];
                          updated[idx].period = e.target.value;
                          setCvData({ ...cvData, experience: updated });
                        }}
                      />
                      <Textarea 
                        rows={2}
                        placeholder="Bullet points / Key achievements..." 
                        value={exp.description} 
                        onChange={e => {
                          const updated = [...cvData.experience];
                          updated[idx].description = e.target.value;
                          setCvData({ ...cvData, experience: updated });
                        }}
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Skills & Projects */}
            <TabsContent value="skills" className="mt-4 space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Key Skills</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Input 
                      placeholder="Add a skill (e.g. Python, Public Speaking)..." 
                      value={newSkill} 
                      onChange={e => setNewSkill(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && handleAddSkill()}
                    />
                    <Button size="sm" onClick={handleAddSkill}>Add</Button>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {cvData.skills.map(s => (
                      <Badge key={s} variant="secondary" className="px-2.5 py-1 text-xs gap-1">
                        {s}
                        <button onClick={() => handleRemoveSkill(s)} className="hover:text-destructive">×</button>
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-3">
                  <div>
                    <CardTitle className="text-base">Projects</CardTitle>
                    <CardDescription>Academic or personal portfolio projects</CardDescription>
                  </div>
                  <Button size="sm" variant="outline" onClick={handleAddProject} className="gap-1 text-xs">
                    <Plus className="w-3.5 h-3.5" /> Add Project
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {cvData.projects.map((proj, idx) => (
                    <div key={proj.id} className="p-3 border rounded-lg space-y-3 bg-sidebar/50">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold uppercase text-muted-foreground">Project #{idx + 1}</span>
                        <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => handleRemoveProject(proj.id)}>
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <Input 
                          placeholder="Project Title" 
                          value={proj.title} 
                          onChange={e => {
                            const updated = [...cvData.projects];
                            updated[idx].title = e.target.value;
                            setCvData({ ...cvData, projects: updated });
                          }}
                        />
                        <Input 
                          placeholder="Tech Stack / Tools" 
                          value={proj.tech} 
                          onChange={e => {
                            const updated = [...cvData.projects];
                            updated[idx].tech = e.target.value;
                            setCvData({ ...cvData, projects: updated });
                          }}
                        />
                      </div>
                      <Textarea 
                        rows={2}
                        placeholder="Description..." 
                        value={proj.description} 
                        onChange={e => {
                          const updated = [...cvData.projects];
                          updated[idx].description = e.target.value;
                          setCvData({ ...cvData, projects: updated });
                        }}
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Live Resume Preview */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Live Document Preview</span>
            <div className="flex items-center gap-1.5 bg-sidebar p-1 rounded-lg border text-xs">
              <button 
                className={`px-2.5 py-1 rounded-md transition-colors ${template === "modern" ? "bg-primary text-primary-foreground font-semibold" : "text-muted-foreground"}`}
                onClick={() => setTemplate("modern")}
              >
                Modern
              </button>
              <button 
                className={`px-2.5 py-1 rounded-md transition-colors ${template === "clean" ? "bg-primary text-primary-foreground font-semibold" : "text-muted-foreground"}`}
                onClick={() => setTemplate("clean")}
              >
                Clean
              </button>
              <button 
                className={`px-2.5 py-1 rounded-md transition-colors ${template === "executive" ? "bg-primary text-primary-foreground font-semibold" : "text-muted-foreground"}`}
                onClick={() => setTemplate("executive")}
              >
                Classic
              </button>
            </div>
          </div>

          <div id="cv-preview" className="bg-white text-gray-900 p-8 rounded-xl shadow-lg border min-h-[750px] font-sans text-sm space-y-6">
            {/* Header */}
            <div className={`pb-4 border-b ${template === "executive" ? "text-center border-gray-300" : template === "modern" ? "border-primary/40" : "border-gray-200"}`}>
              <h2 className="text-2xl font-bold tracking-tight text-gray-900 uppercase">{cvData.fullName || "Your Full Name"}</h2>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-600 mt-2 justify-start">
                {cvData.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{cvData.email}</span>}
                {cvData.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{cvData.phone}</span>}
                {cvData.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{cvData.location}</span>}
                {cvData.website && <span className="flex items-center gap-1"><Globe className="w-3 h-3" />{cvData.website}</span>}
                {cvData.linkedin && <span className="flex items-center gap-1"><Linkedin className="w-3 h-3" />{cvData.linkedin}</span>}
                {cvData.github && <span className="flex items-center gap-1"><Github className="w-3 h-3" />{cvData.github}</span>}
              </div>
            </div>

            {/* Profile Summary */}
            {cvData.summary && (
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5 border-b pb-1">Professional Summary</h3>
                <p className="text-xs text-gray-700 leading-relaxed">{cvData.summary}</p>
              </div>
            )}

            {/* Education */}
            {cvData.education.length > 0 && (
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 border-b pb-1">Education</h3>
                <div className="space-y-3">
                  {cvData.education.map(e => (
                    <div key={e.id} className="flex justify-between items-start">
                      <div>
                        <div className="font-semibold text-xs text-gray-900">{e.degree}</div>
                        <div className="text-xs text-gray-600">{e.school}</div>
                        {e.grade && <div className="text-[11px] text-gray-500 italic mt-0.5">{e.grade}</div>}
                      </div>
                      <div className="text-xs text-gray-500 font-medium">{e.year}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Experience */}
            {cvData.experience.length > 0 && (
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 border-b pb-1">Work Experience</h3>
                <div className="space-y-3">
                  {cvData.experience.map(exp => (
                    <div key={exp.id}>
                      <div className="flex justify-between items-start">
                        <div className="font-semibold text-xs text-gray-900">{exp.role} <span className="font-normal text-gray-600">| {exp.company}</span></div>
                        <div className="text-xs text-gray-500 font-medium">{exp.period}</div>
                      </div>
                      {exp.description && <p className="text-xs text-gray-700 mt-1 leading-relaxed">{exp.description}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Projects */}
            {cvData.projects.length > 0 && (
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 border-b pb-1">Projects</h3>
                <div className="space-y-2.5">
                  {cvData.projects.map(p => (
                    <div key={p.id}>
                      <div className="font-semibold text-xs text-gray-900">{p.title} {p.tech && <span className="text-[11px] text-gray-500 font-normal">({p.tech})</span>}</div>
                      {p.description && <p className="text-xs text-gray-700 mt-0.5">{p.description}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Skills */}
            {cvData.skills.length > 0 && (
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 border-b pb-1">Technical Skills</h3>
                <div className="flex flex-wrap gap-1.5">
                  {cvData.skills.map(s => (
                    <span key={s} className="px-2 py-0.5 bg-gray-100 text-gray-800 rounded text-xs border border-gray-200">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState, useMemo } from "react";
import { useRequireAuth } from "@/hooks/use-require-auth";
import { learningDatabase } from "@/lib/learning-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { ExternalLink, PlayCircle, FileText, Globe, BookOpen, Book, MonitorPlay, ChevronRight, Layers } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function LearningHub() {
  const user = useRequireAuth();
  
  // Filter states
  const [selectedCountry, setSelectedCountry] = useState<string>("UK");
  const [selectedUni, setSelectedUni] = useState<string>("");
  const [selectedDegree, setSelectedDegree] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<number>(1);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>("");

  if (!user) return null;

  // Derive cascaded options
  const countries = learningDatabase.map(c => c.country);
  const currentCountryData = learningDatabase.find(c => c.country === selectedCountry) || learningDatabase[0];
  
  const unis = currentCountryData.universities;
  const currentUniData = unis.find(u => u.id === selectedUni) || unis[0];
  
  const degrees = currentUniData.degrees;
  const currentDegreeData = degrees.find(d => d.id === selectedDegree) || degrees[0];
  
  const yearsData = currentDegreeData.years;
  const currentYearData = yearsData.find(y => y.year === selectedYear) || yearsData[0];
  
  const subjects = currentYearData.subjects;
  const currentSubject = subjects.find(s => s.id === selectedSubjectId) || subjects[0];

  // Initialize selected values on first render or when parents change
  if (selectedUni !== currentUniData.id && unis.length > 0) setSelectedUni(unis[0].id);
  if (selectedDegree !== currentDegreeData.id && degrees.length > 0) setSelectedDegree(degrees[0].id);
  if (!yearsData.some(y => y.year === selectedYear)) setSelectedYear(yearsData[0]?.year || 1);
  if (selectedSubjectId !== currentSubject?.id && subjects.length > 0) setSelectedSubjectId(subjects[0].id);

  const totalResources = currentSubject ? (
    currentSubject.learningPaths.reduce((acc, p) => acc + p.resources.length, 0) +
    currentSubject.recommendedWebsites.length +
    currentSubject.onlineCourses.length +
    currentSubject.documentation.length +
    currentSubject.books.length +
    currentSubject.youtubePlaylists.length +
    currentSubject.practiceMaterial.length
  ) : 0;

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Learning Hub</h1>
        <p className="text-muted-foreground mt-2">
          Comprehensive study paths, resources, and modules tailored to your degree.
        </p>
      </div>

      {/* Cascading Filters */}
      <div className="bg-card border rounded-xl p-4 md:p-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <div>
            <label className="text-xs font-semibold uppercase text-muted-foreground mb-1.5 block">Country</label>
            <Select value={selectedCountry} onChange={(e) => setSelectedCountry(e.target.value)}>
              {countries.map(c => <option key={c} value={c}>{c}</option>)}
            </Select>
          </div>
          <div>
            <label className="text-xs font-semibold uppercase text-muted-foreground mb-1.5 block">University</label>
            <Select value={selectedUni} onChange={(e) => setSelectedUni(e.target.value)}>
              {unis.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
            </Select>
          </div>
          <div>
            <label className="text-xs font-semibold uppercase text-muted-foreground mb-1.5 block">Degree</label>
            <Select value={selectedDegree} onChange={(e) => setSelectedDegree(e.target.value)}>
              {degrees.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </Select>
          </div>
          <div>
            <label className="text-xs font-semibold uppercase text-muted-foreground mb-1.5 block">Year</label>
            <Select value={selectedYear.toString()} onChange={(e) => setSelectedYear(Number(e.target.value))}>
              {yearsData.map(y => <option key={y.year} value={y.year.toString()}>Year {y.year}</option>)}
            </Select>
          </div>
          <div>
            <label className="text-xs font-semibold uppercase text-muted-foreground mb-1.5 block">Subject Module</label>
            <Select value={selectedSubjectId} onChange={(e) => setSelectedSubjectId(e.target.value)}>
              {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </Select>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {currentSubject && (
          <motion.div 
            key={currentSubject.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b pb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary" className="bg-primary/10 text-primary">{currentSubject.code}</Badge>
                  <span className="text-sm text-muted-foreground font-medium">{currentDegreeData.faculty}</span>
                </div>
                <h2 className="text-2xl font-bold text-foreground">{currentSubject.name}</h2>
              </div>
              <Badge variant="outline" className="px-3 py-1.5 text-sm h-fit shrink-0 font-normal">
                <Layers className="w-4 h-4 mr-2 text-primary" />
                {totalResources} curated resources
              </Badge>
            </div>

            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="bg-sidebar w-full flex overflow-x-auto justify-start h-auto p-1 sticky top-0 z-10 rounded-lg">
                <TabsTrigger value="overview" className="shrink-0 py-2">Overview</TabsTrigger>
                <TabsTrigger value="path" className="shrink-0 py-2">Learning Path</TabsTrigger>
                <TabsTrigger value="resources" className="shrink-0 py-2">Resources</TabsTrigger>
                <TabsTrigger value="books" className="shrink-0 py-2">Books</TabsTrigger>
                <TabsTrigger value="youtube" className="shrink-0 py-2">YouTube</TabsTrigger>
                <TabsTrigger value="practice" className="shrink-0 py-2">Practice</TabsTrigger>
              </TabsList>

              <div className="mt-6">
                <TabsContent value="overview" className="space-y-8 m-0">
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="font-semibold text-lg mb-3">Course Overview</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {currentSubject.courseOverview}
                      </p>
                    </CardContent>
                  </Card>
                  
                  <div>
                    <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-primary" /> 
                      Curriculum Modules
                    </h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      {currentSubject.modules.map((mod, i) => (
                        <Card key={mod.name} className="bg-sidebar/50 border-border">
                          <CardContent className="p-5">
                            <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                              <span className="bg-primary/20 text-primary text-xs w-6 h-6 flex items-center justify-center rounded-full shrink-0">
                                {i + 1}
                              </span>
                              {mod.name}
                            </h4>
                            <ul className="space-y-2">
                              {mod.topics.map((topic, j) => (
                                <li key={j} className="text-sm text-muted-foreground flex items-start gap-2">
                                  <ChevronRight className="w-4 h-4 mt-0.5 text-primary/50 shrink-0" />
                                  {topic}
                                </li>
                              ))}
                            </ul>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="path" className="m-0">
                  <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
                    {currentSubject.learningPaths.map((path, index) => (
                      <div key={path.level} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-background bg-primary/20 text-primary font-bold shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10">
                          {index + 1}
                        </div>
                        <Card className="w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] hover-elevate transition-all border-border">
                          <CardHeader className="pb-3 border-b bg-sidebar/50">
                            <CardTitle className="text-lg flex items-center justify-between">
                              {path.level} Stage
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="p-0">
                            <div className="divide-y divide-border">
                              {path.resources.map((res, j) => (
                                <a key={j} href={res.url} target="_blank" rel="noreferrer" className="flex items-start gap-3 p-4 hover:bg-muted/50 transition-colors group/link">
                                  <div className="mt-0.5">
                                    {res.type === 'youtube' ? <PlayCircle className="w-4 h-4 text-red-500" /> :
                                     res.type === 'course' ? <MonitorPlay className="w-4 h-4 text-blue-500" /> :
                                     <Globe className="w-4 h-4 text-green-500" />}
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <h5 className="font-medium text-sm group-hover/link:text-primary transition-colors">{res.title}</h5>
                                      {res.free && <Badge variant="outline" className="text-[9px] h-4 px-1 py-0 bg-green-500/10 text-green-600 border-green-200">FREE</Badge>}
                                    </div>
                                    <p className="text-xs text-muted-foreground">{res.description}</p>
                                  </div>
                                </a>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="resources" className="m-0 space-y-6">
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {/* Recommended Websites */}
                    {currentSubject.recommendedWebsites.map((site, i) => (
                      <Card key={i} className="hover-elevate flex flex-col group">
                        <CardContent className="p-5 flex flex-col h-full">
                          <Badge variant="secondary" className="w-fit mb-4 bg-blue-500/10 text-blue-500 hover:bg-blue-500/20">Website</Badge>
                          <h4 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">{site.name}</h4>
                          <p className="text-sm text-muted-foreground mb-6 flex-1">{site.description}</p>
                          <Button variant="outline" size="sm" className="w-full mt-auto" asChild>
                            <a href={site.url} target="_blank" rel="noreferrer">Visit Site <ExternalLink className="w-3 h-3 ml-2" /></a>
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                    {/* Online Courses */}
                    {currentSubject.onlineCourses.map((course, i) => (
                      <Card key={i + 'c'} className="hover-elevate flex flex-col group">
                        <CardContent className="p-5 flex flex-col h-full">
                          <div className="flex justify-between items-center mb-4">
                            <Badge variant="secondary" className="bg-purple-500/10 text-purple-500 hover:bg-purple-500/20">Course</Badge>
                            {course.free && <Badge variant="outline" className="text-[10px]">FREE</Badge>}
                          </div>
                          <h4 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">{course.name}</h4>
                          <p className="text-xs font-medium text-muted-foreground mb-6 flex-1 bg-sidebar w-fit px-2 py-1 rounded-md">{course.platform}</p>
                          <Button variant="outline" size="sm" className="w-full mt-auto" asChild>
                            <a href={course.url} target="_blank" rel="noreferrer">View Course <ExternalLink className="w-3 h-3 ml-2" /></a>
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="books" className="m-0">
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {currentSubject.books.map((book, i) => (
                      <Card key={i} className="hover-elevate flex flex-row items-center gap-4 p-4">
                        <div className="w-16 h-20 bg-sidebar border rounded shadow-sm flex items-center justify-center text-muted-foreground shrink-0">
                          <Book className="w-6 h-6 opacity-50" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm line-clamp-2 mb-1">{book.title}</h4>
                          <p className="text-xs text-muted-foreground">{book.author}</p>
                          {book.year && <span className="text-[10px] text-muted-foreground/60 mt-2 block">Published {book.year}</span>}
                        </div>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="youtube" className="m-0">
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {currentSubject.youtubePlaylists.map((pl, i) => (
                      <Card key={i} className="hover-elevate group overflow-hidden border-border bg-card">
                        <div className="aspect-video bg-muted relative flex items-center justify-center">
                          <div className="absolute inset-0 bg-red-500/10 group-hover:bg-red-500/20 transition-colors" />
                          <PlayCircle className="w-12 h-12 text-red-500 drop-shadow-md group-hover:scale-110 transition-transform" />
                        </div>
                        <CardContent className="p-4">
                          <h4 className="font-semibold text-sm line-clamp-2 mb-2 group-hover:text-primary transition-colors">{pl.title}</h4>
                          <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                            <MonitorPlay className="w-3.5 h-3.5" /> {pl.channel}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="practice" className="m-0">
                  <div className="grid gap-4 md:grid-cols-2">
                    {currentSubject.practiceMaterial.map((pm, i) => (
                      <Card key={i} className="hover-elevate transition-all group">
                        <CardContent className="p-5 flex items-start gap-4">
                          <div className="w-12 h-12 rounded-full bg-orange-500/10 text-orange-500 flex items-center justify-center shrink-0">
                            <FileText className="w-5 h-5" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">{pm.name}</h4>
                            <p className="text-sm text-muted-foreground mb-3">{pm.description}</p>
                            <Button variant="link" className="p-0 h-auto text-primary" asChild>
                              <a href={pm.url} target="_blank" rel="noreferrer">Access Material <ExternalLink className="w-3 h-3 ml-1" /></a>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

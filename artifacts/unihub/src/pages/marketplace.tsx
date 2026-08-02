import { useState, useEffect } from "react";
import { useRequireAuth } from "@/hooks/use-require-auth";
import { MarketplaceItem } from "@/lib/mock-data";
import { getStorage, setStorage } from "@/lib/storage";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Store, Tag, MapPin, Search, Plus, Heart, MessageCircle, Star, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Marketplace() {
  const user = useRequireAuth();
  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [activeTab, setActiveTab] = useState("all");

  // Form State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [listingType, setListingType] = useState<MarketplaceItem['listingType']>("Item");
  const [category, setCategory] = useState<MarketplaceItem['category']>("Books");
  const [condition, setCondition] = useState<MarketplaceItem['condition']>("Good");
  const [description, setDescription] = useState("");
  
  // Message Modal State
  const [messageDialogOpen, setMessageDialogOpen] = useState(false);
  const [selectedSeller, setSelectedSeller] = useState<{name: string, id: string} | null>(null);
  const [messageText, setMessageText] = useState("");

  useEffect(() => {
    if (user) {
      setItems(getStorage<MarketplaceItem[]>('unihub_marketplace', []));
    }
  }, [user]);

  if (!user) return null;

  const handlePost = () => {
    if (!title || !price) return;
    const newItem: MarketplaceItem = {
      id: Math.random().toString(36).substring(7),
      title,
      price: Number(price),
      category,
      listingType,
      condition: listingType === 'Item' ? condition : undefined,
      description,
      sellerName: user.name,
      sellerUniversity: user.university,
      tags: [category],
      createdAt: new Date().toISOString()
    };
    
    const updated = [newItem, ...items];
    setItems(updated);
    setStorage('unihub_marketplace', updated);
    setIsDialogOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setTitle("");
    setPrice("");
    setListingType("Item");
    setCategory("Books");
    setCondition("Good");
    setDescription("");
  };

  const toggleWishlist = (id: string) => {
    const updated = items.map(i => i.id === id ? { ...i, wishlisted: !i.wishlisted } : i);
    setItems(updated);
    setStorage('unihub_marketplace', updated);
  };

  const handleSendMessage = () => {
    if (!selectedSeller || !messageText.trim()) return;
    
    // Create new conversation in localStorage
    const convos = getStorage<any[]>('unihub_conversations', []);
    const convoId = `c_mkpt_${Math.random().toString(36).substr(2, 6)}`;
    
    const newConvo = {
      id: convoId,
      type: 'marketplace',
      name: `Inquiry to ${selectedSeller.name}`,
      participants: [selectedSeller.id, "currentUser"],
      avatarFallback: selectedSeller.name.substring(0, 2).toUpperCase(),
      unreadCount: 0,
      lastActivity: new Date().toISOString(),
      messages: [
        {
          id: Math.random().toString(36).substr(2, 6),
          senderId: "currentUser",
          text: messageText,
          timestamp: new Date().toISOString(),
          read: true
        }
      ]
    };
    
    setStorage('unihub_conversations', [newConvo, ...convos]);
    // Dispatch event so sidebar updates unread count if we weren't read
    window.dispatchEvent(new Event('unihub_messages_updated'));
    
    setMessageDialogOpen(false);
    setMessageText("");
  };

  const openMessageDialog = (item: MarketplaceItem) => {
    setSelectedSeller({ name: item.sellerName, id: `u_${item.sellerName.replace(/\s/g, '')}` });
    setMessageText(`Hi! I'm interested in your ${item.listingType.toLowerCase()} "${item.title}". Is it still available?`);
    setMessageDialogOpen(true);
  };

  const filteredItems = items.filter(i => {
    const matchesSearch = i.title.toLowerCase().includes(search.toLowerCase());
    const matchesCat = categoryFilter === "All" || i.category === categoryFilter;
    const matchesTab = activeTab === "all" || 
                      (activeTab === "services" && i.listingType === "Service") || 
                      (activeTab === "items" && i.listingType === "Item");
    return matchesSearch && matchesCat && matchesTab;
  });

  const categories = ["All", ...Array.from(new Set(items.map(i => i.category))).sort()];

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Marketplace & Services</h1>
          <p className="text-muted-foreground mt-2">
            Buy, sell, and offer skills within your university network.
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={open => { setIsDialogOpen(open); if(!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="shadow-sm">
              <Plus className="w-4 h-4 mr-2" />
              Create Listing
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create a new listing</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="flex gap-4 p-1 bg-sidebar rounded-lg">
                <Button 
                  type="button" 
                  variant={listingType === 'Item' ? 'default' : 'ghost'} 
                  className="flex-1"
                  onClick={() => setListingType('Item')}
                >
                  <Tag className="w-4 h-4 mr-2" /> Physical Item
                </Button>
                <Button 
                  type="button" 
                  variant={listingType === 'Service' ? 'default' : 'ghost'} 
                  className="flex-1"
                  onClick={() => setListingType('Service')}
                >
                  <Sparkles className="w-4 h-4 mr-2" /> Skill / Service
                </Button>
              </div>

              <div className="space-y-2">
                <Label>Title</Label>
                <Input value={title} onChange={e => setTitle(e.target.value)} placeholder={listingType === 'Item' ? "e.g. Calculus 8th Edition" : "e.g. Python Tutoring - 1 Hour"} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Price ($)</Label>
                  <Input type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="45.00" />
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={category} onChange={e => setCategory(e.target.value as any)}>
                    <option value="Books">Books</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Study Equipment">Equipment</option>
                    <option value="Programming">Programming</option>
                    <option value="Design">Design</option>
                    <option value="Tutoring">Tutoring</option>
                    <option value="Writing">Writing</option>
                    <option value="Other">Other</option>
                  </Select>
                </div>
              </div>
              
              {listingType === 'Item' && (
                <div className="space-y-2">
                  <Label>Condition</Label>
                  <Select value={condition} onChange={e => setCondition(e.target.value as any)}>
                    <option value="New">New</option>
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                  </Select>
                </div>
              )}

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea 
                  value={description} 
                  onChange={e => setDescription(e.target.value)} 
                  placeholder={listingType === 'Item' ? "Any specific details, damages, or pickup instructions..." : "Detail your expertise, availability, and what's included..."} 
                  rows={4}
                />
              </div>
              <Button className="w-full" onClick={handlePost}>Publish Listing</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search items or services..." 
              className="pl-9 h-10"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="w-full sm:w-64">
            <Select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
              {categories.map(c => <option key={c} value={c}>{c === "All" ? "All Categories" : c}</option>)}
            </Select>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-sidebar">
            <TabsTrigger value="all" className="px-6">All Listings</TabsTrigger>
            <TabsTrigger value="services" className="px-6">Services & Skills</TabsTrigger>
            <TabsTrigger value="items" className="px-6">Physical Items</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <AnimatePresence>
          {filteredItems.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: Math.min(idx * 0.05, 0.3) }}
            >
              <Card className="hover-elevate h-full flex flex-col overflow-hidden bg-card border-border group relative">
                <div className={`aspect-[4/3] relative flex items-center justify-center border-b transition-colors ${item.listingType === 'Service' ? 'bg-primary/5 group-hover:bg-primary/10' : 'bg-sidebar group-hover:bg-muted'}`}>
                  {item.listingType === 'Service' ? (
                    <Sparkles className="w-16 h-16 opacity-20 text-primary" />
                  ) : (
                    <Store className="w-16 h-16 opacity-20 text-muted-foreground" />
                  )}
                  
                  <div className="absolute top-3 left-3 flex gap-2">
                    <Badge variant={item.listingType === 'Service' ? 'default' : 'secondary'} className="shadow-sm">
                      {item.listingType}
                    </Badge>
                  </div>
                  
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className={`absolute top-2 right-2 rounded-full bg-background/80 backdrop-blur-sm border shadow-sm hover:bg-background ${item.wishlisted ? 'text-red-500 border-red-200' : 'text-muted-foreground hover:text-red-500'}`}
                    onClick={() => toggleWishlist(item.id)}
                  >
                    <Heart className={`w-4 h-4 ${item.wishlisted ? 'fill-current' : ''}`} />
                  </Button>
                </div>
                
                <CardContent className="p-5 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-2 gap-2">
                    <h3 className="font-bold text-lg line-clamp-2 group-hover:text-primary transition-colors leading-tight">{item.title}</h3>
                    <span className="font-black text-lg text-foreground shrink-0 bg-primary/10 text-primary px-2 py-0.5 rounded-md">${item.price}</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-3 text-xs text-muted-foreground">
                    <Badge variant="outline" className="font-normal bg-sidebar border-border/50">{item.category}</Badge>
                    {item.condition && <Badge variant="outline" className="font-normal bg-sidebar border-border/50">{item.condition}</Badge>}
                  </div>
                  
                  <p className="text-sm text-foreground/80 line-clamp-3 mb-6 flex-1 leading-relaxed">
                    {item.description}
                  </p>
                  
                  <div className="pt-4 border-t border-border/50 mt-auto">
                    <div className="flex items-center justify-between group/seller cursor-pointer">
                      <div className="flex items-center gap-2 min-w-0">
                        <Avatar className="w-8 h-8 border border-border/50 shrink-0">
                          <AvatarFallback className="bg-primary/5 text-primary text-xs font-bold">
                            {item.sellerName.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col min-w-0">
                          <span className="text-xs font-semibold truncate group-hover/seller:text-primary transition-colors">
                            {item.sellerName}
                          </span>
                          {item.listingType === 'Service' && item.rating ? (
                            <span className="flex items-center text-[10px] text-yellow-500 font-medium">
                              <Star className="w-3 h-3 fill-current mr-0.5" /> {item.rating} ({item.reviewCount})
                            </span>
                          ) : (
                            <span className="flex items-center text-[10px] text-muted-foreground truncate">
                              <MapPin className="w-3 h-3 mr-0.5 shrink-0" /> {item.sellerUniversity}
                            </span>
                          )}
                        </div>
                      </div>
                      <Button size="sm" onClick={() => openMessageDialog(item)} className="shrink-0 shadow-sm ml-2">
                        Contact
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-24 border-2 border-dashed rounded-xl bg-sidebar/30 border-border/60">
          <Tag className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
          <h3 className="font-semibold text-xl text-foreground">No listings found</h3>
          <p className="text-muted-foreground mt-2 max-w-md mx-auto">Try a different search or be the first to sell an item or offer a service in this category.</p>
        </div>
      )}

      {/* Message Seller Dialog */}
      <Dialog open={messageDialogOpen} onOpenChange={setMessageDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Message {selectedSeller?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Your Message</Label>
              <Textarea 
                value={messageText}
                onChange={e => setMessageText(e.target.value)}
                className="min-h-[120px] resize-none"
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setMessageDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSendMessage}>
                <MessageCircle className="w-4 h-4 mr-2" />
                Send Message
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

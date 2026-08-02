import { useState, useEffect, useRef } from "react";
import {
  Folder,
  FileItem,
  subscribeFolders,
  subscribeFiles,
  createFolder,
  uploadFileToStorage,
  deleteFolder,
  deleteFileItemAndStorage,
  formatBytes,
} from "@/lib/firestore-service";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Select } from "@/components/ui/select";
import {
  FolderPlus,
  Folder as FolderIcon,
  FileText,
  Trash2,
  HardDrive,
  Loader2,
  UploadCloud,
  Download,
  FileUp,
  X,
  ExternalLink,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface MyFilesSectionProps {
  userId: string;
}

export function MyFilesSection({ userId }: MyFilesSectionProps) {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loadingFolders, setLoadingFolders] = useState(true);
  const [loadingFiles, setLoadingFiles] = useState(true);

  // Modals state
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [isFileModalOpen, setIsFileModalOpen] = useState(false);

  // Form state - Folder
  const [folderName, setFolderName] = useState("");
  const [creatingFolder, setCreatingFolder] = useState(false);
  const [folderError, setFolderError] = useState("");

  // Form state - File Upload
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFolderId, setSelectedFolderId] = useState<string>("none");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [fileError, setFileError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!userId) return;

    setLoadingFolders(true);
    setLoadingFiles(true);

    const unsubFolders = subscribeFolders(
      userId,
      (data) => {
        setFolders(data);
        setLoadingFolders(false);
      },
      () => setLoadingFolders(false)
    );

    const unsubFiles = subscribeFiles(
      userId,
      (data) => {
        setFiles(data);
        setLoadingFiles(false);
      },
      () => setLoadingFiles(false)
    );

    return () => {
      unsubFolders();
      unsubFiles();
    };
  }, [userId]);

  const handleCreateFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!folderName.trim()) {
      setFolderError("Folder name is required");
      return;
    }
    setFolderError("");
    setCreatingFolder(true);
    try {
      await createFolder(userId, folderName);
      setFolderName("");
      setIsFolderModalOpen(false);
    } catch {
      setFolderError("Failed to create folder. Please try again.");
    } finally {
      setCreatingFolder(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setFileError("");
    }
  };

  const handleUploadFile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setFileError("Please choose a file to upload");
      return;
    }

    setFileError("");
    setUploading(true);
    setUploadProgress(0);

    try {
      const folderId = selectedFolderId === "none" ? undefined : selectedFolderId;
      await uploadFileToStorage(userId, selectedFile, folderId, (progress) => {
        setUploadProgress(progress);
      });

      // Reset and close
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setSelectedFolderId("none");
      setUploadProgress(0);
      setIsFileModalOpen(false);
    } catch (err) {
      setFileError(err instanceof Error ? err.message : "Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteFolder = async (id: string) => {
    try {
      await deleteFolder(userId, id);
    } catch (err) {
      console.error("Delete folder error:", err);
    }
  };

  const handleDeleteFile = async (file: FileItem) => {
    try {
      await deleteFileItemAndStorage(userId, file);
    } catch (err) {
      console.error("Delete file error:", err);
    }
  };

  const handleDownloadFile = (file: FileItem) => {
    if (file.downloadURL) {
      window.open(file.downloadURL, "_blank", "noopener,noreferrer");
    }
  };

  const getFolderName = (folderId?: string) => {
    if (!folderId) return null;
    const f = folders.find((item) => item.id === folderId);
    return f ? f.name : null;
  };

  const getFileTypeLabel = (type?: string, name?: string) => {
    if (type && type !== "application/octet-stream" && type !== "document") {
      const parts = type.split("/");
      return parts[parts.length - 1].toUpperCase();
    }
    if (name && name.includes(".")) {
      const ext = name.split(".").pop();
      return ext ? ext.toUpperCase() : "FILE";
    }
    return "FILE";
  };

  return (
    <Card className="border rounded-2xl shadow-sm">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4">
        <div>
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <HardDrive className="w-5 h-5 text-primary" />
            My Files
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground mt-0.5">
            Organize and manage your private cloud documents stored securely with Firebase.
          </CardDescription>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setFolderError("");
              setFolderName("");
              setIsFolderModalOpen(true);
            }}
            className="gap-1.5"
          >
            <FolderPlus className="w-4 h-4 text-primary" />
            New Folder
          </Button>
          <Button
            size="sm"
            onClick={() => {
              setFileError("");
              setSelectedFile(null);
              setUploadProgress(0);
              if (fileInputRef.current) fileInputRef.current.value = "";
              setSelectedFolderId("none");
              setIsFileModalOpen(true);
            }}
            className="gap-1.5"
          >
            <FileUp className="w-4 h-4" />
            Add File
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Folders Section */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            Folders ({folders.length})
          </h4>
          {loadingFolders ? (
            <div className="flex items-center justify-center p-6 border rounded-xl bg-muted/20">
              <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
            </div>
          ) : folders.length === 0 ? (
            <div className="p-4 border border-dashed rounded-xl text-center text-xs text-muted-foreground bg-muted/10">
              No folders created yet. Click &quot;New Folder&quot; to organize your files.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {folders.map((folder) => (
                <div
                  key={folder.id}
                  className="group relative flex items-center justify-between p-3 border rounded-xl bg-card hover:bg-muted/30 transition-all"
                >
                  <div className="flex items-center gap-2.5 min-w-0 pr-2">
                    <FolderIcon className="w-4 h-4 text-primary shrink-0" />
                    <span className="text-sm font-medium truncate">{folder.name}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:bg-destructive/10"
                    onClick={() => handleDeleteFolder(folder.id)}
                    title="Delete folder"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Files Section */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            Files ({files.length})
          </h4>
          {loadingFiles ? (
            <div className="flex items-center justify-center p-6 border rounded-xl bg-muted/20">
              <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
            </div>
          ) : files.length === 0 ? (
            <div className="p-8 border border-dashed rounded-xl text-center text-muted-foreground bg-muted/10 space-y-2">
              <FileText className="w-8 h-8 mx-auto text-muted-foreground/60" />
              <p className="text-sm font-medium text-foreground">No files uploaded yet</p>
              <p className="text-xs text-muted-foreground">Upload documents to your secure cloud storage.</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-2 text-xs"
                onClick={() => {
                  setFileError("");
                  setSelectedFile(null);
                  setUploadProgress(0);
                  if (fileInputRef.current) fileInputRef.current.value = "";
                  setSelectedFolderId("none");
                  setIsFileModalOpen(true);
                }}
              >
                Upload First File
              </Button>
            </div>
          ) : (
            <div className="divide-y border rounded-xl overflow-hidden bg-card">
              {files.map((file) => {
                const folderName = getFolderName(file.folderId);
                const typeLabel = getFileTypeLabel(file.type, file.name);
                return (
                  <div
                    key={file.id}
                    className="flex items-center justify-between p-3.5 hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0 pr-4">
                      <div className="p-2.5 rounded-lg bg-primary/10 text-primary shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <h5 className="text-sm font-semibold truncate">{file.name}</h5>
                        <div className="flex items-center gap-2 mt-0.5 text-xs text-muted-foreground">
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0 font-mono">
                            {typeLabel}
                          </Badge>
                          <span>•</span>
                          <span>{file.size}</span>
                          <span>•</span>
                          <span>{new Date(file.createdAt).toLocaleDateString()}</span>
                          {folderName && (
                            <>
                              <span>•</span>
                              <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                                {folderName}
                              </Badge>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      {file.downloadURL && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 gap-1 text-xs"
                          onClick={() => handleDownloadFile(file)}
                          title="Download file"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Download</span>
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        onClick={() => handleDeleteFile(file)}
                        title="Delete file"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </CardContent>

      {/* New Folder Modal */}
      <Dialog open={isFolderModalOpen} onOpenChange={setIsFolderModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Folder</DialogTitle>
            <DialogDescription>
              Enter a name for your new folder to keep your files organized.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateFolder} className="space-y-4 pt-2">
            {folderError && (
              <div className="p-2.5 rounded-lg bg-destructive/10 text-destructive text-xs">
                {folderError}
              </div>
            )}
            <div className="space-y-1.5">
              <Label htmlFor="folder-name">Folder Name</Label>
              <Input
                id="folder-name"
                placeholder="e.g. Computer Science Notes"
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
                disabled={creatingFolder}
                autoFocus
              />
            </div>
            <DialogFooter className="gap-2 sm:gap-0 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsFolderModalOpen(false)}
                disabled={creatingFolder}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={creatingFolder || !folderName.trim()}>
                {creatingFolder ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Folder"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Upload File Modal */}
      <Dialog open={isFileModalOpen} onOpenChange={(open) => !uploading && setIsFileModalOpen(open)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upload File</DialogTitle>
            <DialogDescription>
              Upload a file to your secure Firebase Storage workspace bucket.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleUploadFile} className="space-y-4 pt-2">
            {fileError && (
              <div className="p-2.5 rounded-lg bg-destructive/10 text-destructive text-xs">
                {fileError}
              </div>
            )}

            {/* Hidden file input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              disabled={uploading}
            />

            {/* File selection box */}
            <div className="space-y-2">
              <Label>File Selection</Label>
              {selectedFile ? (
                <div className="flex items-center justify-between p-3 border rounded-xl bg-card">
                  <div className="flex items-center gap-2.5 min-w-0 pr-2">
                    <FileText className="w-5 h-5 text-primary shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{selectedFile.name}</p>
                      <p className="text-xs text-muted-foreground">{formatBytes(selectedFile.size)}</p>
                    </div>
                  </div>
                  {!uploading && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-foreground"
                      onClick={() => {
                        setSelectedFile(null);
                        if (fileInputRef.current) fileInputRef.current.value = "";
                      }}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed rounded-xl p-6 text-center hover:bg-muted/30 cursor-pointer transition-colors space-y-2"
                >
                  <UploadCloud className="w-8 h-8 mx-auto text-primary" />
                  <div className="text-sm font-medium">Click to select a file</div>
                  <p className="text-xs text-muted-foreground">PDFs, documents, images, zip files up to 50MB</p>
                </div>
              )}
            </div>

            {/* Folder selection */}
            <div className="space-y-1.5">
              <Label htmlFor="file-folder">Folder (Optional)</Label>
              <Select
                id="file-folder"
                value={selectedFolderId}
                onChange={(e) => setSelectedFolderId(e.target.value)}
                disabled={uploading}
              >
                <option value="none">Root Directory (No folder)</option>
                {folders.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                  </option>
                ))}
              </Select>
            </div>

            {/* Upload progress */}
            {uploading && (
              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between text-xs text-muted-foreground font-medium">
                  <span>Uploading to Firebase Storage...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
              </div>
            )}

            <DialogFooter className="gap-2 sm:gap-0 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsFileModalOpen(false)}
                disabled={uploading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={uploading || !selectedFile}>
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Uploading ({uploadProgress}%)
                  </>
                ) : (
                  "Upload File"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

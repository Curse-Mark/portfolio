import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { uploadFile } from '@/lib/upload';
import { signInAsAdmin } from '@/lib/auth';
import { ExternalLink } from 'lucide-react';
import type { AdminCredentials, Skill, Achievement, Project, Certification } from '@/lib/types';

const ADMIN_CREDENTIALS: AdminCredentials = {
  username: 'admin',
  password: 'admin123'
};

export default function Admin() {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<'skills' | 'achievements' | 'projects' | 'certifications'>('skills');
  const [skills, setSkills] = useState<Skill[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [uploading, setUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      setIsConnecting(true);
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;
      if (session) {
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Session check error:', error);
      toast.error('Failed to check authentication status. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated, activeTab]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      let error = null;
      let data = null;

      switch (activeTab) {
        case 'skills':
          ({ data, error } = await supabase
            .from('skills')
            .select('*')
            .order('category'));
          if (error) throw error;
          setSkills(data || []);
          break;
        case 'achievements':
          ({ data, error } = await supabase
            .from('achievements')
            .select('*')
            .order('date', { ascending: false }));
          if (error) throw error;
          setAchievements(data || []);
          break;
        case 'projects':
          ({ data, error } = await supabase
            .from('projects')
            .select('*')
            .order('date', { ascending: false }));
          if (error) throw error;
          setProjects(data || []);
          break;
        case 'certifications':
          ({ data, error } = await supabase
            .from('certifications')
            .select('*')
            .order('date', { ascending: false }));
          if (error) throw error;
          setCertifications(data || []);
          break;
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      if (error instanceof Error) {
        if (error.message.includes('Failed to fetch')) {
          toast.error('Connection error. Please check your internet connection and try again.');
        } else {
          toast.error(`Failed to fetch data: ${error.message}`);
        }
      } else {
        toast.error('Failed to fetch data. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (
        credentials.username !== ADMIN_CREDENTIALS.username ||
        credentials.password !== ADMIN_CREDENTIALS.password
      ) {
        throw new Error('Invalid admin credentials');
      }

      await signInAsAdmin(credentials.username, credentials.password);
      setIsAuthenticated(true);
      toast.success('Successfully logged in as admin');
    } catch (error) {
      console.error('Error signing in:', error);
      if (error instanceof Error) {
        if (error.message.includes('Failed to fetch')) {
          toast.error('Connection error. Please check your internet connection and try again.');
        } else {
          toast.error(error.message);
        }
      } else {
        toast.error('An unexpected error occurred during login');
      }
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (file: File): Promise<string> => {
    if (!file) {
      throw new Error('No file selected');
    }

    try {
      setUploading(true);
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Please sign in to upload files');
      }

      const { fullPath } = await uploadFile(file);
      return fullPath;
    } catch (error) {
      console.error('Error uploading file:', error);
      if (error instanceof Error) {
        if (error.message.includes('Permission denied')) {
          toast.error('Permission denied. Please try signing out and back in.');
        } else if (error.message.includes('Failed to fetch')) {
          toast.error('Connection error. Please check your internet connection and try again.');
        } else {
          toast.error(error.message);
        }
      } else {
        toast.error('An unexpected error occurred during file upload');
      }
      throw error;
    } finally {
      setUploading(false);
    }
  };

  const handleAddSkill = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    
    const proficiencyValue = formData.get('proficiency');
    if (!proficiencyValue) {
      toast.error('Proficiency is required');
      return;
    }

    const proficiency = parseInt(proficiencyValue as string, 10);
    if (isNaN(proficiency) || proficiency < 0 || proficiency > 100) {
      toast.error('Proficiency must be a number between 0 and 100');
      return;
    }
    
    const newSkill = {
      name: formData.get('name') as string,
      category: formData.get('category') as 'technical' | 'soft',
      proficiency: proficiency,
    };

    try {
      const { error } = await supabase
        .from('skills')
        .insert([newSkill]);
      
      if (error) throw error;
      
      toast.success('Skill added successfully');
      form.reset();
      fetchData();
    } catch (error) {
      console.error('Error adding skill:', error);
      if (error instanceof Error && error.message.includes('Failed to fetch')) {
        toast.error('Connection error. Please check your internet connection and try again.');
      } else {
        toast.error('Failed to add skill');
      }
    }
  };

  const handleAddAchievement = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    
    try {
      const imageFile = formData.get('image') as File;
      if (!imageFile || imageFile.size === 0) {
        throw new Error('Please select an image file');
      }

      const imageUrl = await handleFileUpload(imageFile);
      
      const newAchievement = {
        title: formData.get('title') as string,
        description: formData.get('description') as string,
        image_url: imageUrl,
        date: formData.get('date') as string,
      };

      const { error } = await supabase
        .from('achievements')
        .insert([newAchievement]);
      
      if (error) throw error;
      
      toast.success('Achievement added successfully');
      form.reset();
      fetchData();
    } catch (error) {
      console.error('Error adding achievement:', error);
      if (error instanceof Error) {
        if (error.message.includes('Failed to fetch')) {
          toast.error('Connection error. Please check your internet connection and try again.');
        } else {
          toast.error(error.message);
        }
      } else {
        toast.error('Failed to add achievement');
      }
    }
  };

  const handleAddProject = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    
    try {
      const imageFile = formData.get('image') as File;
      if (!imageFile || imageFile.size === 0) {
        throw new Error('Please select an image file');
      }

      const imageUrl = await handleFileUpload(imageFile);
      
      const newProject = {
        title: formData.get('title') as string,
        description: formData.get('description') as string,
        image_url: imageUrl,
        date: formData.get('date') as string,
        tags: (formData.get('tags') as string).split(',').map(tag => tag.trim()),
      };

      const { error } = await supabase
        .from('projects')
        .insert([newProject]);
      
      if (error) throw error;
      
      toast.success('Project added successfully');
      form.reset();
      fetchData();
    } catch (error) {
      console.error('Error adding project:', error);
      if (error instanceof Error) {
        if (error.message.includes('Failed to fetch')) {
          toast.error('Connection error. Please check your internet connection and try again.');
        } else {
          toast.error(error.message);
        }
      } else {
        toast.error('Failed to add project');
      }
    }
  };

  const handleAddCertification = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    
    const newCertification = {
      title: formData.get('title') as string,
      issuer: formData.get('issuer') as string,
      date: formData.get('date') as string,
      credential_url: formData.get('credential_url') as string || null,
    };

    try {
      const { error } = await supabase
        .from('certifications')
        .insert([newCertification]);
      
      if (error) throw error;
      
      toast.success('Certification added successfully');
      form.reset();
      fetchData();
    } catch (error) {
      console.error('Error adding certification:', error);
      if (error instanceof Error && error.message.includes('Failed to fetch')) {
        toast.error('Connection error. Please check your internet connection and try again.');
      } else {
        toast.error('Failed to add certification');
      }
    }
  };

  const handleDelete = async (table: string, id: string) => {
    try {
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast.success(`${table.slice(0, -1)} deleted successfully`);
      fetchData();
    } catch (error) {
      console.error(`Error deleting ${table.slice(0, -1)}:`, error);
      if (error instanceof Error && error.message.includes('Failed to fetch')) {
        toast.error('Connection error. Please check your internet connection and try again.');
      } else {
        toast.error(`Failed to delete ${table.slice(0, -1)}`);
      }
    }
  };

  if (isConnecting) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Connecting to server...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
              Admin Login
            </h2>
            <form onSubmit={handleLogin} className="mt-8 space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    value={credentials.username}
                    onChange={(e) =>
                      setCredentials({ ...credentials, username: e.target.value })
                    }
                    required
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={credentials.password}
                    onChange={(e) =>
                      setCredentials({ ...credentials, password: e.target.value })
                    }
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Signing in...' : 'Sign in'}
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900">Admin Dashboard</h1>
            <Button
              variant="outline"
              onClick={async () => {
                try {
                  await supabase.auth.signOut();
                  setIsAuthenticated(false);
                  setCredentials({ username: '', password: '' });
                  navigate('/');
                  toast.success('Successfully logged out.');
                } catch (error) {
                  console.error('Error signing out:', error);
                  toast.error('Failed to sign out. Please try again.');
                }
              }}
            >
              Logout
            </Button>
          </div>

          <div className="flex space-x-4 mb-8">
            <Button
              variant={activeTab === 'skills' ? 'default' : 'outline'}
              onClick={() => setActiveTab('skills')}
            >
              Skills
            </Button>
            <Button
              variant={activeTab === 'achievements' ? 'default' : 'outline'}
              onClick={() => setActiveTab('achievements')}
            >
              Achievements
            </Button>
            <Button
              variant={activeTab === 'projects' ? 'default' : 'outline'}
              onClick={() => setActiveTab('projects')}
            >
              Projects
            </Button>
            <Button
              variant={activeTab === 'certifications' ? 'default' : 'outline'}
              onClick={() => setActiveTab('certifications')}
            >
              Certifications
            </Button>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
          ) : (
            <>
              <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
                {activeTab === 'skills' && (
                  <form onSubmit={handleAddSkill} className="space-y-4">
                    <h2 className="text-xl font-semibold mb-4">Add New Skill</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" name="name" required />
                      </div>
                      <div>
                        <Label htmlFor="category">Category</Label>
                        <select
                          id="category"
                          name="category"
                          className="mt-1 block w-full rounded-md border border-green-200 bg-white px-3 py-2 text-sm shadow-sm"
                          required
                        >
                          <option value="technical">Technical</option>
                          <option value="soft">Soft</option>
                        </select>
                      </div>
                      <div>
                        <Label htmlFor="proficiency">
                          Proficiency (0-100)
                        </Label>
                        <Input
                          id="proficiency"
                          name="proficiency"
                          type="number"
                          min="0"
                          max="100"
                          defaultValue="0"
                          required
                        />
                      </div>
                    </div>
                    <Button type="submit">Add Skill</Button>
                  </form>
                )}

                {activeTab === 'achievements' && (
                  <form onSubmit={handleAddAchievement} className="space-y-4">
                    <h2 className="text-xl font-semibold mb-4">Add New Achievement</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <Label htmlFor="title">Title</Label>
                        <Input id="title" name="title" required />
                      </div>
                      <div className="md:col-span-2">
                        <Label htmlFor="description">Description</Label>
                        <textarea
                          id="description"
                          name="description"
                          className="mt-1 block w-full rounded-md border border-green-200 bg-white px-3 py-2 text-sm shadow-sm"
                          rows={4}
                          required
                        ></textarea>
                      </div>
                      <div className="md:col-span-2">
                        <Label htmlFor="image">Image</Label>
                        <Input
                          id="image"
                          name="image"
                          type="file"
                          accept="image/*"
                          required
                          disabled={uploading}
                        />
                      </div>
                      <div>
                        <Label htmlFor="date">Date</Label>
                        <Input id="date" name="date" type="date" required />
                      </div>
                    </div>
                    <Button type="submit" disabled={uploading}>
                      {uploading ? 'Uploading...' : 'Add Achievement'}
                    </Button>
                  </form>
                )}

                {activeTab === 'projects' && (
                  <form onSubmit={handleAddProject} className="space-y-4">
                    <h2 className="text-xl font-semibold mb-4">Add New Project</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <Label htmlFor="title">Title</Label>
                        <Input id="title" name="title" required />
                      </div>
                      <div className="md:col-span-2">
                        <Label htmlFor="description">Description</Label>
                        <textarea
                          id="description"
                          name="description"
                          className="mt-1 block w-full rounded-md border border-green-200 bg-white px-3 py-2 text-sm shadow-sm"
                          rows={4}
                          required
                        ></textarea>
                      </div>
                      <div className="md:col-span-2">
                        <Label htmlFor="image">Image</Label>
                        <Input
                          id="image"
                          name="image"
                          type="file"
                          accept="image/*"
                          required
                          disabled={uploading}
                        />
                      </div>
                      <div>
                        <Label htmlFor="date">Date</Label>
                        <Input id="date" name="date" type="date" required />
                      </div>
                      <div>
                        <Label htmlFor="tags">
                          Tags (comma-separated)
                        </Label>
                        <Input
                          id="tags"
                          name="tags"
                          placeholder="React, TypeScript, Node.js"
                          required
                        />
                      </div>
                    </div>
                    <Button type="submit" disabled={uploading}>
                      {uploading ? 'Uploading...' : 'Add Project'}
                    </Button>
                  </form>
                )}

                {activeTab === 'certifications' && (
                  <form onSubmit={handleAddCertification} className="space-y-4">
                    <h2 className="text-xl font-semibold mb-4">Add New Certification</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <Label htmlFor="title">Title</Label>
                        <Input id="title" name="title" required />
                      </div>
                      <div className="md:col-span-2">
                        <Label htmlFor="issuer">Issuer</Label>
                        <Input id="issuer" name="issuer" required />
                      </div>
                      <div>
                        <Label htmlFor="date">Date</Label>
                        <Input id="date" name="date" type="date" required />
                      </div>
                      <div>
                        <Label htmlFor="credential_url">Credential URL (optional)</Label>
                        <Input id="credential_url" name="credential_url" type="url" />
                      </div>
                    </div>
                    <Button type="submit">Add Certification</Button>
                  </form>
                )}
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold mb-4">
                  Manage {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                </h2>
                
                {activeTab === 'skills' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {skills.map((skill) => (
                      <div
                        key={skill.id}
                        className="flex justify-between items-center p-4 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <h3 className="font-medium">{skill.name}</h3>
                          <p className="text-sm text-gray-600">
                            {skill.category}
                            {skill.proficiency !== null && ` • ${skill.proficiency}%`}
                          </p>
                        </div>
                        <Button
                          variant="destructive"
                          onClick={() => handleDelete('skills', skill.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'achievements' && (
                  <div className="grid grid-cols-1 gap-4">
                    {achievements.map((achievement) => (
                      <div
                        key={achievement.id}
                        className="flex justify-between items-center p-4 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <h3 className="font-medium">{achievement.title}</h3>
                          <p className="text-sm text-gray-600">
                            {new Date(achievement.date).toLocaleDateString()}
                          </p>
                        </div>
                        <Button
                          variant="destructive"
                          onClick={() => handleDelete('achievements', achievement.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'projects' && (
                  <div className="grid grid-cols-1 gap-4">
                    {projects.map((project) => (
                      <div
                        key={project.id}
                        className="flex justify-between items-center p-4 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <h3 className="font-medium">{project.title}</h3>
                          <p className="text-sm text-gray-600">
                            {new Date(project.date).toLocaleDateString()}
                          </p>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {project.tags.map((tag) => (
                              <span
                                key={tag}
                                className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                        <Button
                          variant="destructive"
                          onClick={() => handleDelete('projects', project.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'certifications' && (
                  <div className="grid grid-cols-1 gap-4">
                    {certifications.map((cert) => (
                      <div
                        key={cert.id}
                        className="flex justify-between items-center p-4 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <h3 className="font-medium">{cert.title}</h3>
                          <p className="text-sm text-gray-600">
                            {cert.issuer} • {new Date(cert.date).toLocaleDateString()}
                          </p>
                          {cert.credential_url && (
                            <a
                              href={cert.credential_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-green-600 hover:text-green-700 flex items-center gap-1"
                            >
                              View Credential <ExternalLink className="h-3 w-3" />
                            </a>
                          )}
                        </div>
                        <Button
                          variant="destructive"
                          onClick={() => handleDelete('certifications', cert.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}
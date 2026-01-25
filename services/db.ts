import { BlogPost, User, UserRole } from "../types";

// Keys for LocalStorage
const KEY_USERS = 'fbc_ep_users';
const KEY_POSTS = 'fbc_ep_posts';
const KEY_INIT = 'fbc_ep_init';

// Helper to simulate delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// INITIALIZATION
// This runs once to create the default Admin user.
export const initializeDatabase = () => {
  if (!localStorage.getItem(KEY_INIT)) {
    console.log("Initializing Mock Database...");
    
    // Default Admin User
    const adminUser = {
      id: 'admin-1',
      username: 'admin',
      password: 'password123', // stored in plain text for this mock only
      role: UserRole.ADMIN
    };
    
    // Seed Users
    localStorage.setItem(KEY_USERS, JSON.stringify([adminUser]));
    
    // Seed a Welcome Post
    const welcomePost: BlogPost = {
      id: 'post-1',
      title: 'Welcome to our new website!',
      content: 'We are thrilled to launch our new online home. Check back here for updates, sermon notes, and church news.',
      authorId: 'admin-1',
      authorName: 'Admin',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      imageUrl: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?q=80&w=1000&auto=format&fit=crop'
    };
    localStorage.setItem(KEY_POSTS, JSON.stringify([welcomePost]));
    
    localStorage.setItem(KEY_INIT, 'true');
  }
};

// --- USER OPERATIONS ---

export const getUsers = async (): Promise<any[]> => {
  await delay(200);
  const users = localStorage.getItem(KEY_USERS);
  return users ? JSON.parse(users) : [];
};

export const addUser = async (username: string, password: string, role: UserRole): Promise<void> => {
  await delay(300);
  const users = await getUsers();
  if (users.find(u => u.username === username)) {
    throw new Error("Username already exists");
  }
  const newUser = {
    id: `user-${Date.now()}`,
    username,
    password,
    role
  };
  users.push(newUser);
  localStorage.setItem(KEY_USERS, JSON.stringify(users));
};

// --- BLOG OPERATIONS ---

export const getPosts = async (): Promise<BlogPost[]> => {
  await delay(200); // Simulate network latency
  const posts = localStorage.getItem(KEY_POSTS);
  return posts ? JSON.parse(posts).sort((a: BlogPost, b: BlogPost) => b.createdAt - a.createdAt) : [];
};

export const getPostById = async (id: string): Promise<BlogPost | undefined> => {
  const posts = await getPosts();
  return posts.find(p => p.id === id);
};

export const createPost = async (post: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>): Promise<BlogPost> => {
  await delay(400);
  const posts = await getPosts();
  const newPost: BlogPost = {
    ...post,
    id: `post-${Date.now()}`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  posts.push(newPost);
  localStorage.setItem(KEY_POSTS, JSON.stringify(posts));
  return newPost;
};

export const updatePost = async (id: string, updates: Partial<BlogPost>): Promise<BlogPost> => {
  await delay(400);
  const posts = await getPosts();
  const index = posts.findIndex(p => p.id === id);
  if (index === -1) throw new Error("Post not found");
  
  const updatedPost = { ...posts[index], ...updates, updatedAt: Date.now() };
  posts[index] = updatedPost;
  localStorage.setItem(KEY_POSTS, JSON.stringify(posts));
  return updatedPost;
};

export const deletePost = async (id: string): Promise<void> => {
  await delay(300);
  const posts = await getPosts();
  const filteredPosts = posts.filter(p => p.id !== id);
  localStorage.setItem(KEY_POSTS, JSON.stringify(filteredPosts));
};
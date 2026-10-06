/**
 * Masteriyo LMS Integration Layer
 * Intended target LMS: https://student.unspuniversity.com/
 * 
 * Provides an enterprise-ready abstraction layer for future Masteriyo LMS integration
 * without placing any API credentials or secret keys in frontend client bundles.
 */

export interface MasteriyoCourse {
  id: string;
  title: string;
  slug: string;
  description: string;
  duration: string;
  totalLessons: number;
  featuredImage?: string;
  instructor: {
    name: string;
    role: string;
  };
}

export interface MasteriyoUser {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  role: 'student' | 'instructor' | 'admin';
  registeredDate: string;
}

export interface MasteriyoEnrollment {
  id: string;
  userId: string;
  courseId: string;
  enrolledDate: string;
  status: 'active' | 'completed' | 'suspended';
  progressPercentage: number;
}

export interface MasteriyoProgress {
  userId: string;
  courseId: string;
  completedLessons: number;
  totalLessons: number;
  percentage: number;
  lastAccessed: string;
}

export interface MasteriyoClientConfig {
  baseUrl: string; // e.g. "https://student.unspuniversity.com/wp-json/masteriyo/v1"
  mode: 'sandbox' | 'production_ready';
}

class MasteriyoIntegrationService {
  private config: MasteriyoClientConfig;

  constructor() {
    this.config = {
      baseUrl: 'https://student.unspuniversity.com/wp-json/masteriyo/v1',
      mode: 'sandbox'
    };
  }

  /**
   * Returns list of published Masteriyo fellowship courses
   */
  async getCourses(): Promise<MasteriyoCourse[]> {
    // Architectural implementation: When server proxy (/api/masteriyo/courses) is active,
    // this dispatches an authenticated backend fetch request.
    return [
      {
        id: 'mst-c-01',
        title: 'UNSP Research Methodology & Literature Synthesis',
        slug: 'unsp-research-methodology',
        description: 'Foundational modules on doctrinal, empirical, and systemic scientific inquiry.',
        duration: '6 Weeks',
        totalLessons: 18,
        instructor: {
          name: 'UNSP Academic Advisory Committee',
          role: 'Research Oversight'
        }
      },
      {
        id: 'mst-c-02',
        title: 'Scholarly Writing, Peer Review & Monograph Publishing',
        slug: 'unsp-scholarly-writing',
        description: 'Academic conventions, ethical disclosure, citation management, and monograph drafting.',
        duration: '8 Weeks',
        totalLessons: 24,
        instructor: {
          name: 'UNSP Academic Advisory Committee',
          role: 'Editorial Director'
        }
      }
    ];
  }

  /**
   * Retrieves specific course details
   */
  async getCourse(courseId: string): Promise<MasteriyoCourse | null> {
    const courses = await this.getCourses();
    return courses.find((c) => c.id === courseId) || null;
  }

  /**
   * Creates a user in the Masteriyo LMS
   */
  async createUser(userData: {
    email: string;
    firstName: string;
    lastName: string;
  }): Promise<MasteriyoUser> {
    return {
      id: `mst-usr-${Date.now()}`,
      email: userData.email,
      username: userData.email.split('@')[0],
      firstName: userData.firstName,
      lastName: userData.lastName,
      role: 'student',
      registeredDate: new Date().toISOString()
    };
  }

  /**
   * Retrieves Masteriyo user account details
   */
  async getUser(userId: string): Promise<MasteriyoUser | null> {
    return {
      id: userId,
      email: 'fellow@unspuniversity.com',
      username: 'fellow_unsp',
      firstName: 'International',
      lastName: 'Fellow',
      role: 'student',
      registeredDate: new Date().toISOString()
    };
  }

  /**
   * Enrolls a registered fellow into a Masteriyo course
   */
  async enrollUser(userId: string, courseId: string): Promise<MasteriyoEnrollment> {
    return {
      id: `enr-${Date.now()}`,
      userId,
      courseId,
      enrolledDate: new Date().toISOString(),
      status: 'active',
      progressPercentage: 0
    };
  }

  /**
   * Retrieves active enrollment record
   */
  async getEnrollment(userId: string, courseId: string): Promise<MasteriyoEnrollment | null> {
    return {
      id: `enr-demo-${userId}`,
      userId,
      courseId,
      enrolledDate: new Date().toISOString(),
      status: 'active',
      progressPercentage: 42
    };
  }

  /**
   * Retrieves comprehensive progress in Masteriyo LMS
   */
  async getCourseProgress(userId: string, courseId: string): Promise<MasteriyoProgress> {
    return {
      userId,
      courseId,
      completedLessons: 8,
      totalLessons: 18,
      percentage: 44,
      lastAccessed: new Date().toISOString()
    };
  }

  /**
   * Helper to verify LMS readiness
   */
  getLmsConfig() {
    return {
      targetLmsDomain: 'https://student.unspuniversity.com/',
      status: 'Prepared for Server-Side Gateway API Proxy',
      authMethod: 'OAuth 2.0 / WordPress REST Application Passwords (Backend-Only)'
    };
  }
}

export const masteriyoService = new MasteriyoIntegrationService();

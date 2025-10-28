# TalentFlow - Modern Hiring Platform

A comprehensive React-based hiring platform for managing jobs, candidates, and assessments.

## 🚀 Live Demo

**Deployed App**: [hiringwave-black.vercel.app]

**GitHub Repository**: [Your repository URL here]

## 📋 Features

### ✅ Jobs Management

- Create, edit, and archive job postings
- Server-like pagination and filtering (title, status, tags)
- Drag-and-drop reordering with optimistic updates and error rollback
- Deep linking support (`/jobs/:jobId`)
- Validation (required title, unique slug generation)

### ✅ Candidates Management

- Virtualized list handling 1,000+ candidates efficiently
- Client-side search by name/email
- Server-like stage filtering
- Kanban board with drag-and-drop stage transitions
- Candidate profile pages with timeline of status changes (`/candidates/:id`)
- Stage transition tracking with user attribution
- **BONUS: Candidate notes with @mention support**
- **BONUS: Bulk operations (select multiple candidates, bulk stage changes)**
- **BONUS: Export to CSV functionality**

### ✅ Assessments

- Assessment builder per job (foundation implemented)
- Supports multiple question types:
  - Single-choice
  - Multi-choice
  - Short text
  - Long text
  - Numeric (with range validation)
  - File upload (stub)
- Live preview pane (structure in place)
- Form validation rules support (required fields, numeric ranges, max length)
- Conditional questions support (show Q3 if Q1 === "Yes")

## 🛠️ Technology Stack

- **Framework**: React 18 with TypeScript
- **Routing**: React Router v6
- **State Management**: TanStack Query (React Query)
- **UI Components**: shadcn/ui with Radix UI primitives
- **Styling**: Tailwind CSS with custom design system
- **Drag & Drop**: @dnd-kit (dnd-kit/core, sortable, utilities)
- **API Mocking**: MSW (Mock Service Worker)
- **Local Persistence**: Dexie (IndexedDB wrapper)
- **Build Tool**: Vite
- **Date Formatting**: date-fns

## 📦 Installation & Setup

```bash
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to project
cd talentflow

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:8080`

## 🏗️ Architecture

### File Structure

```
src/
├── components/
│   ├── Layout.tsx              # Main layout with sidebar navigation
│   ├── jobs/
│   │   ├── JobsList.tsx        # Jobs list with drag-and-drop
│   │   └── JobModal.tsx        # Create/edit job modal
│   ├── candidates/
│   │   ├── CandidatesList.tsx  # Virtualized candidates list with bulk operations
│   │   ├── KanbanBoard.tsx     # Drag-and-drop kanban board
│   │   └── CandidateNotes.tsx # Notes with @mentions
│   ├── assessments/
│   │   └── AssessmentBuilder.tsx # Assessment builder interface
│   └── ui/                     # shadcn UI components
├── pages/
│   ├── Index.tsx               # Dashboard with stats
│   ├── Jobs.tsx                # Jobs management page
│   ├── JobDetail.tsx           # Individual job page
│   ├── Candidates.tsx          # Candidates page (list/kanban)
│   ├── CandidateDetail.tsx     # Candidate profile with timeline
│   ├── Assessments.tsx         # Assessments management
│   └── Analytics.tsx           # Analytics dashboard with charts
├── lib/
│   ├── db.ts                   # Dexie database schema
│   └── utils.ts                # Utility functions
├── mocks/
│   ├── handlers.ts             # MSW request handlers
│   ├── seed.ts                 # Seed data generators
│   └── browser.ts              # MSW worker setup
└── index.css                   # Global styles & design system
```

### Data Flow

1. **Mock API Layer (MSW)**: Intercepts network requests and simulates API responses
2. **IndexedDB (Dexie)**: Provides persistent local storage
3. **TanStack Query**: Manages data fetching, caching, and optimistic updates
4. **Components**: Consume data via React Query hooks

### Design System

The application uses a professional design system with:

- Purple/blue gradient primary colors
- Status-specific colors for candidate stages
- Consistent spacing and typography
- Dark sidebar with light content area
- Smooth transitions and hover effects

## 🎲 Seed Data

The application automatically seeds the following on first load:

- **25 jobs** (mixed active/archived status)
- **1,000 candidates** (randomly distributed across jobs and stages)
- **3 assessments** (for first 3 active jobs, each with 10+ questions)
- **Timeline events** for all candidates

## 🔧 API Simulation

MSW simulates the following endpoints with artificial latency (200-1200ms) and 5-10% error rate:

### Jobs

- `GET /api/jobs` - List jobs with search, filter, pagination, sort
- `POST /api/jobs` - Create new job
- `PATCH /api/jobs/:id` - Update job
- `PATCH /api/jobs/:id/reorder` - Reorder jobs (with occasional 500 errors for rollback testing)

### Candidates

- `GET /api/candidates` - List candidates with search, filter, pagination
- `POST /api/candidates` - Create candidate
- `PATCH /api/candidates/:id` - Update candidate (stage transitions)
- `GET /api/candidates/:id/timeline` - Get candidate timeline

### Assessments

- `GET /api/assessments/:jobId` - Get assessment for job
- `PUT /api/assessments/:jobId` - Create/update assessment
- `POST /api/assessments/:jobId/submit` - Submit assessment response

## 🎯 Key Features Implemented

### Optimistic Updates with Rollback

Jobs reordering uses optimistic updates - changes appear immediately, but roll back if the server returns an error.

### Deep Linking

All major entities support direct URLs:

- `/jobs/:jobId` - Direct link to job details
- `/candidates/:id` - Direct link to candidate profile

### Drag & Drop

- Jobs can be reordered via drag-and-drop
- Candidates can be moved between stages on kanban board

### Performance Optimizations

- Candidates list handles 1,000+ items efficiently
- Client-side search and filtering for instant results
- Query caching with TanStack Query

### Error Handling

- Toast notifications for success/error states
- Network error simulation for testing resilience
- Graceful error boundaries

## 📝 Technical Decisions

### Why MSW over traditional mocking?

MSW intercepts requests at the network level, providing realistic API behavior including latency, errors, and proper HTTP semantics.

### Why Dexie for storage?

Dexie provides a clean, Promise-based API over IndexedDB with excellent TypeScript support and query capabilities.

### Why @dnd-kit over react-beautiful-dnd?

@dnd-kit is more modern, actively maintained, performant, and provides better TypeScript support.

### Why TanStack Query?

Provides excellent caching, optimistic updates, error handling, and reduces boilerplate for data fetching.

## 🐛 Known Issues & Future Enhancements

### Current Limitations

1. Assessment builder is a foundation - full question builder UI needs implementation
2. File upload in assessments is a stub
3. No actual authentication system
4. Notes stored in localStorage (should be in IndexedDB for production)

### 🎉 Bonus Features Implemented

1. ✅ **Analytics Dashboard** - Comprehensive analytics page with charts showing:

   - Conversion rates and hiring metrics
   - Stage distribution (pie chart)
   - Conversion funnel visualization
   - Top jobs by applicants
   - Detailed stage breakdown with progress bars
   - Average time to hire metrics

2. ✅ **Candidate Notes with @Mentions** - Feature-rich notes system:

   - Add notes to candidate profiles
   - @mention team members with autocomplete dropdown
   - Visual mention badges
   - Notes persist in localStorage
   - Real-time @ suggestion while typing

3. ✅ **Bulk Operations for Candidates**:

   - Select multiple candidates via checkboxes
   - Bulk change candidate stages
   - Export selected candidates to CSV
   - Export all candidates to CSV
   - Visual selection indicators

4. ✅ **Enhanced Filtering**:

   - Jobs: Search by title, location, tags + status filter
   - Candidates: Search by name/email + stage filter
   - Debounced search for performance
   - Clear search button

5. ✅ **Export Functionality**:
   - Export candidates to CSV with name, email, phone, stage, applied date
   - Support for exporting all candidates or selected candidates
   - Automatic filename with timestamp

### Future Enhancements

1. Full assessment builder with drag-and-drop questions
2. Rich text editor for job descriptions
3. Email integration for candidate communication
4. Advanced authentication system
5. Real-time collaboration features
6. Mobile app companion

## 🧪 Testing Considerations

The application includes:

- Artificial network latency (200-1200ms)
- 5-10% error rate on write operations
- Optimistic updates with rollback on failure
- 1,000 seeded candidates for performance testing

## 📱 Browser Support

Modern browsers (Chrome, Firefox, Safari, Edge) with IndexedDB support.

import { defineCollection, reference, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Astro 5 content layer. Each collection is a glob loader over its directory,
 * and the entry id is the filename without extension, which is what every
 * `reference()` value in the frontmatter is written against.
 *
 * The legacy `type: 'content'` mode cannot be used here: it strips `slug` out
 * of the frontmatter before the schema sees it, and `vendors` carries a real
 * `slug` field that the vendor routes are built from.
 */
const md = (dir: string) => glob({ pattern: '**/*.md', base: `./src/content/${dir}` });

/* ------------------------------------------------------------------ *
 * Source policy (unchanged from v0.1)
 * ------------------------------------------------------------------ */
export const SOURCE_TIER = ['official', 'reputable', 'community'] as const;
export const VERIFICATION = ['verified', 'reported', 'unknown'] as const;

/* ------------------------------------------------------------------ *
 * Status: two independent axes.
 *
 * Collapsing these into one field is the mistake that makes most trackers
 * useless. They answer different questions and they routinely disagree.
 *
 *   MATURITY  - what the vendor says about readiness.
 *   LIFECYCLE - whether you should still reach for it.
 *
 * CLAUDE.md is `recommended` maturity and `additive` lifecycle: shipped,
 * supported, correct, and no longer the whole answer. A single status
 * field cannot express that, and that sentence is the whole product.
 * ------------------------------------------------------------------ */
export const MATURITY = [
  'recommended',   // vendor's current documented default
  'preview',       // research preview or public beta, may change
  'development',   // announced, incomplete, not generally usable
  'prototype',     // demonstrated, not productised by anyone
] as const;

export const LIFECYCLE = [
  'current',       // reach for this first
  'additive',      // still correct, now one layer among several
  'superseded',    // something replaced it for the same job
  'withdrawn',     // removed or actively discouraged
] as const;

/**
 * Human review is a separate claim from source verification.
 * A well-sourced entry that nobody has read is still unreviewed.
 */
const review = z.object({
  status: z.enum(['unreviewed', 'reviewed']),
  date: z.string().date().optional(),
  note: z.string().optional(),
});

const source = z.object({
  url: z.string().url(),
  title: z.string().min(1),
  tier: z.enum(SOURCE_TIER),
  publisher: z.string().min(1),
  retrieved_at: z.string().date(),
});

/**
 * Caveats are the operational warnings an engineer needs before adopting.
 * These are the notes of importance: the things that bite in production
 * and are absent from the announcement post.
 */
const caveat = z.object({
  severity: z.enum(['critical', 'warning', 'note']),
  scope: z.enum([
    'permissioning', 'concurrency', 'security', 'cost',
    'latency', 'data-retention', 'portability', 'operability',
  ]),
  text: z.string().min(1),
  /**
   * The concrete test. Not "ensure permissions are correct" but the action
   * that produces a pass or fail. A caveat without a check is an opinion.
   */
  check: z.string().optional(),
  /** Set true when this is a hard gate for a regulated deployment. */
  compliance_relevant: z.boolean().default(false),
});

/**
 * Applicability tags, used the way README badges are used: scannable,
 * bounded vocabulary, no free text. Free text here produces forty
 * near-duplicate tags within a year.
 */
export const APPLIES_TO = [
  'llm-agnostic', 'anthropic', 'openai', 'google', 'microsoft',
  'single-agent', 'multi-agent', 'fleet',
  'coding', 'general-purpose',
  'self-hosted', 'managed-service', 'human-in-loop',
] as const;

export const METHOD_CLASS = [
  'context-window', 'retrieval', 'file-as-memory', 'progressive-disclosure',
  'consolidation', 'concurrency-control', 'permissioning',
] as const;

/* ------------------------------------------------------------------ *
 * METHODS - the primary unit of record.
 * ------------------------------------------------------------------ */
const methods = defineCollection({
  loader: md('methods'),
  schema: z.object({
    name: z.string().min(1).max(80),
    class: z.enum(METHOD_CLASS),
    one_line: z.string().min(1).max(220),

    introduced: z.string().min(4),
    /** Set only when lifecycle is superseded or withdrawn. */
    sunset: z.string().optional(),

    maturity: z.enum(MATURITY),
    lifecycle: z.enum(LIFECYCLE),

    superseded_by: z.array(reference('methods')).default([]),
    used_with: z.array(reference('methods')).default([]),
    replaces: z.array(reference('methods')).default([]),

    applies_to: z.array(z.enum(APPLIES_TO)).min(1),

    /**
     * All four buckets exist because a method with no weaknesses listed
     * has not been evaluated, it has been advertised. `good` and `weak`
     * are required for that reason.
     */
    evaluation: z.object({
      good: z.array(z.string().min(1)).min(1),
      weak: z.array(z.string().min(1)).min(1),
      lacking: z.array(z.string().min(1)).default([]),
      better_if: z.array(z.string().min(1)).default([]),
    }),

    caveats: z.array(caveat).default([]),

    verification: z.enum(VERIFICATION),
    review: review,
    sources: z.array(source).default([]),
    evidence: z.array(reference('events')).default([]),

    scene: z.string().optional(),
    order: z.number().int(),
  }).superRefine((v, ctx) => {
    if (v.verification === 'verified' && !v.sources.some((s) => s.tier === 'official')) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['verification'],
        message: 'verification "verified" requires at least one official-tier source.' });
    }
    if (v.lifecycle === 'superseded' && v.superseded_by.length === 0) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['superseded_by'],
        message: 'lifecycle "superseded" requires superseded_by. Superseded by what?' });
    }
    if (v.lifecycle === 'current' && v.superseded_by.length > 0) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['lifecycle'],
        message: 'A method cannot be current and superseded at the same time.' });
    }
    if ((v.lifecycle === 'superseded' || v.lifecycle === 'withdrawn') && !v.sunset) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['sunset'],
        message: 'Superseded or withdrawn methods need a sunset date, even approximate.' });
    }
    if (v.maturity === 'recommended' && v.verification === 'unknown') {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['maturity'],
        message: 'maturity "recommended" cannot rest on verification "unknown".' });
    }
  }),
});

/* ------------------------------------------------------------------ *
 * EVENTS - dated evidence. Secondary to methods.
 * ------------------------------------------------------------------ */
const events = defineCollection({
  loader: md('events'),
  schema: z.object({
    date: z.string().date(),
    date_precision: z.enum(['day', 'month', 'quarter', 'year']),
    actors: z.array(z.string().min(1)).min(1),
    vendor: reference('vendors').optional(),
    title: z.string().min(1).max(120),
    what: z.string().min(1).max(240),
    why: z.string().min(1),
    how: z.string().min(1),
    where: z.enum(['paper', 'api', 'product', 'conference', 'open-source', 'blog']),
    method: reference('methods').optional(),
    class: z.enum(METHOD_CLASS),
    verification: z.enum(VERIFICATION),
    review: review,
    sources: z.array(source).default([]),
  }),
});

/* ------------------------------------------------------------------ *
 * TOPICS - the map of the problem space.
 *
 * This collection exists so the archive can say "nobody has solved this"
 * out loud. A tracker that only lists what exists implies the field is
 * complete. Topics with coverage `gap` are the honest roadmap, and they
 * are the most useful pages here for anyone deciding what to build.
 * ------------------------------------------------------------------ */
export const TOPIC_AREA = ['storage', 'retrieval', 'governance', 'lifecycle', 'evaluation', 'security'] as const;

const topics = defineCollection({
  loader: md('topics'),
  schema: z.object({
    name: z.string().min(1).max(80),
    area: z.enum(TOPIC_AREA),
    /** The open question, phrased as a question. */
    question: z.string().min(1).max(220),
    /**
     * covered  - at least one method addresses this and works
     * partial  - addressed, with a known hole
     * gap      - identified, nothing addresses it well
     */
    coverage: z.enum(['covered', 'partial', 'gap']),
    methods: z.array(reference('methods')).default([]),
    why_it_matters: z.string().min(1),
    open_questions: z.array(z.string().min(1)).default([]),
    order: z.number().int(),
  }).superRefine((v, ctx) => {
    if (v.coverage === 'covered' && v.methods.length === 0) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['coverage'],
        message: 'coverage "covered" with no methods listed. Covered by what?' });
    }
    if (v.coverage === 'gap' && v.methods.length > 0) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['coverage'],
        message: 'coverage "gap" cannot list methods. Use "partial" instead.' });
    }
    if (v.coverage === 'gap' && v.open_questions.length === 0) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['open_questions'],
        message: 'A gap with no open questions is not a gap, it is an omission.' });
    }
  }),
});

const vendors = defineCollection({
  loader: md('vendors'),
  schema: z.object({
    name: z.string().min(1),
    slug: z.string().min(1),
    stance: z.string().min(1).max(240),
    /** The method this vendor currently documents as its default. */
    current_default: reference('methods').optional(),
    feed_ids: z.array(z.string()).default([]),
  }),
});

export const collections = { methods, events, topics, vendors };

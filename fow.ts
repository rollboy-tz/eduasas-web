import crypto from 'crypto';

/**
 * Muundo wa data ya Challenge inayohifadhiwa kwenye Memory Store.
 */
export type PoWChallenge = {
  /** String ya nasibu inayotumiwa kutengeneza hash */
  seed: string;
  /** Timestamp (in milliseconds) ya muda ambao challenge hii itaisha nguvu */
  expiresAt: number;
};

/**
 * Muundo wa majibu yanayorudishwa baada ya kutengeneza challenge mpya.
 */
export type ChallengeGenerationResult = {
  /** Kitambulisho cha kipekee cha challenge (UUID v4) */
  challengeId: string;
  /** String ya nasibu ya cryptographic hex */
  seed: string;
  /** Idadi ya sifuri za mwanzo zinazohitajika kwenye hash */
  difficulty: number;
};

/** Kiwango cha ugumu cha default: Idadi ya sifuri za mwanzo kwenye SHA-256 hash */
const DEFAULT_DIFFICULTY = 4;

/** Muda wa maisha wa challenge (Sekunde 60 kwa Milliseconds) */
const CHALLENGE_TTL_MS = 60 * 1000;

/** 
 * Memory Store ya muda mfupi kuhifadhi Challenges zilizo active.
 * kwa mifumo mikubwa (Production/Distributed), unashauriwa kutumia Redis badala ya Map.
 */
const activeChallenges = new Map<string, PoWChallenge>();

/**
 * Inatengeneza Proof of Work Challenge mpya kwa ajili ya Client.
 *
 * Function hii inazalisha `challengeId` na `seed` ya nasibu, kisha inaihifadhi kwenye
 * Memory Store ikiwa na muda wa kuisha (Expiration Time) wa sekunde 60.
 *
 * @param {number} [difficulty=DEFAULT_DIFFICULTY] - Idadi ya sifuri za mwanzo zinazotakiwa kwenye hash (default: 4).
 * @returns {ChallengeGenerationResult} Inarudisha object yenye `challengeId`, `seed`, na `difficulty`.
 *
 * @example
 * ```typescript
 * // Kwenye Express Endpoint ya GET /api/pow-challenge
 * app.get('/api/pow-challenge', (req, res) => {
 *   const challenge = generateChallenge();
 *   res.json(challenge);
 * });
 * ```
 */
export function generateChallenge(
  difficulty: number = DEFAULT_DIFFICULTY
): ChallengeGenerationResult {
  const challengeId = crypto.randomUUID();
  const seed = crypto.randomBytes(16).toString('hex');
  
  // Hifadhi challenge kwenye Memory Store
  activeChallenges.set(challengeId, {
    seed,
    expiresAt: Date.now() + CHALLENGE_TTL_MS,
  });

  return { challengeId, seed, difficulty };
}

/**
 * Inathibitisha kama jibu (nonce) lililotumwa na Client ni sahihi kwa Challenge iliyowekwa.
 *
 * Function hii inahakikisha:
 * 1. Challenge ipo na haijaisha muda wake (Expired).
 * 2. Hash ya `seed + nonce` inakidhi vigezo vya `difficulty` (mifano: kuanza na '0000').
 * 3. Challenge inafutwa mara moja baada ya ukaguzi ili kuzuia **Replay Attacks** (kurudia jibu).
 *
 * @param {string} challengeId - Kitambulisho cha challenge kilichotolewa mwanzoni.
 * @param {string | number} nonce - Namba au String ya jibu iliyopatikana na Client.
 * @param {number} [difficulty=DEFAULT_DIFFICULTY] - Kiwango cha ugumu kilichotumika kutengenezea challenge.
 * @returns {boolean} Inarudisha `true` ikiwa jibu ni sahihi na bado lipo valid, au `false` ikiwa ni batili/expired.
 *
 * @example
 * ```typescript
 * // Kwenye Express Endpoint ya POST /api/register
 * app.post('/api/register', (req, res) => {
 *   const { challengeId, nonce, email, password } = req.body;
 * 
 *   const isValid = verifyPoW(challengeId, nonce);
 *   if (!isValid) {
 *     return res.status(403).json({ error: "Invalid or expired PoW solution" });
 *   }
 * 
 *   // Process registration logic here...
 * });
 * ```
 */
export function verifyPoW(
  challengeId: string,
  nonce: string | number,
  difficulty: number = DEFAULT_DIFFICULTY
): boolean {
  const challenge = activeChallenges.get(challengeId);

  // 1. Kama Challenge haipo (imeshafutwa au haikuwahi kuwepo)
  if (!challenge) {
    return false;
  }

  // Futa challenge mara moja kuzuia kutumiwa tena (Prevent Replay Attacks)
  activeChallenges.delete(challengeId);

  // 2. Angalia kama Challenge imewahi kuisha muda (Expired)
  if (Date.now() > challenge.expiresAt) {
    return false;
  }

  // 3. Piga SHA-256 Hash ya (seed + nonce)
  const hash = crypto
    .createHash('sha256')
    .update(`${challenge.seed}${nonce}`)
    .digest('hex');

  const targetPrefix = '0'.repeat(difficulty);

  // 4. Hakikisha hash inaanza na idadi ya sifuri iliyoainishwa
  return hash.startsWith(targetPrefix);
}

/**
 * Zana ya usafi (Garbage Collector) ya hiari ya kuondoa Challenges zilizo-expire kwenye Memory
 * ili kuzuia matumizi yasiyo ya lazima ya RAM pindi maombi yakiwa mengi.
 */
export function cleanupExpiredChallenges(): void {
  const now = Date.now();
  for (const [id, challenge] of activeChallenges.entries()) {
    if (now > challenge.expiresAt) {
      activeChallenges.delete(id);
    }
  }
}
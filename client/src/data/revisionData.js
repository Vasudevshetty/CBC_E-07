// Mock data for Revision component
export const revisionTopics = [
  { id: "math-calculus", name: "Calculus" },
  { id: "math-algebra", name: "Algebra" },
  { id: "physics-mechanics", name: "Mechanics" },
  { id: "chemistry-organic", name: "Organic Chemistry" },
  { id: "biology-genetics", name: "Genetics" },
  { id: "computer-science-algorithms", name: "Algorithms" },
];

// Mock revision content for each topic
export const revisionContent = {
  "math-calculus": `# Calculus: Key Concepts

## Derivatives
A derivative measures how a function changes as its input changes. Mathematically, it is defined as:

$$f'(x) = \lim_{h \to 0} \frac{f(x+h) - f(x)}{h}$$

### Common Derivative Rules:
- Power Rule: $\frac{d}{dx}[x^n] = nx^{n-1}$
- Product Rule: $\frac{d}{dx}[f(x)g(x)] = f'(x)g(x) + f(x)g'(x)$
- Chain Rule: $\frac{d}{dx}[f(g(x))] = f'(g(x)) \cdot g'(x)$

## Integration
Integration is the reverse of differentiation. It is used to find areas under curves and solve differential equations.

### Basic Integration Rules:
- Power Rule: $\int x^n dx = \frac{x^{n+1}}{n+1} + C$ (for $n \neq -1$)
- Exponential Rule: $\int e^x dx = e^x + C$
- Trigonometric Rules: 
  - $\int \sin(x) dx = -\cos(x) + C$
  - $\int \cos(x) dx = \sin(x) + C$

## Applications
- Finding areas between curves
- Calculating volumes of rotation
- Solving rate problems
- Understanding motion and velocity
`,

  "math-algebra": `# Algebra: Core Concepts

## Equations and Inequalities
Solving linear equations: $ax + b = 0$
Solving quadratic equations: $ax^2 + bx + c = 0$

The quadratic formula: $x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}$

## Functions and Graphs
- Domain and Range
- Function composition: $(f \circ g)(x) = f(g(x))$
- Inverse functions: $f^{-1}(f(x)) = x$

## Systems of Equations
Methods of solution:
- Substitution
- Elimination
- Matrix methods

### Matrix Operations
- Addition: $(A + B)_{ij} = A_{ij} + B_{ij}$
- Multiplication: $(AB)_{ij} = \sum_k A_{ik} B_{kj}$
- Determinants and inverses

## Polynomials
- Factoring techniques
- Synthetic division
- Rational roots theorem
`,

  "physics-mechanics": `# Classical Mechanics

## Newton's Laws of Motion

### First Law
An object at rest stays at rest, and an object in motion stays in motion with the same speed and in the same direction, unless acted upon by an external force.

### Second Law
Force equals mass times acceleration: $F = ma$

### Third Law
For every action, there is an equal and opposite reaction.

## Work and Energy
- Work: $W = F \cdot d \cdot \cos\theta$
- Kinetic Energy: $KE = \frac{1}{2}mv^2$
- Potential Energy: $PE = mgh$ (gravitational)
- Conservation of Energy: $KE_1 + PE_1 = KE_2 + PE_2$

## Momentum
- Linear Momentum: $p = mv$
- Conservation of Momentum: $m_1v_1 + m_2v_2 = m_1v_1' + m_2v_2'$
- Impulse: $J = F\Delta t = \Delta p$

## Circular Motion
- Centripetal Acceleration: $a_c = \frac{v^2}{r}$
- Centripetal Force: $F_c = \frac{mv^2}{r}$
`,

  "chemistry-organic": `# Organic Chemistry Fundamentals

## Hydrocarbons
- Alkanes: CnH2n+2 (single bonds)
- Alkenes: CnH2n (contains double bonds)
- Alkynes: CnH2n-2 (contains triple bonds)
- Aromatic compounds: Contains benzene rings

## Functional Groups
- Alcohols (-OH)
- Aldehydes (-CHO)
- Ketones (-CO-)
- Carboxylic acids (-COOH)
- Esters (-COOR)
- Amines (-NH2)

## Reaction Mechanisms
1. Substitution reactions
   - SN1: Unimolecular nucleophilic substitution
   - SN2: Bimolecular nucleophilic substitution
2. Elimination reactions
   - E1: Unimolecular elimination
   - E2: Bimolecular elimination
3. Addition reactions
   - Electrophilic addition
   - Nucleophilic addition

## Stereochemistry
- Isomerism: Different arrangements of the same atoms
- Chirality: Non-superimposable mirror images
- Optical activity: Rotation of plane-polarized light
`,

  "biology-genetics": `# Genetics and Heredity

## DNA Structure
- Double helix structure
- Nucleotides: Adenine, Thymine, Guanine, Cytosine
- Complementary base pairing: A-T, G-C
- Hydrogen bonding between base pairs

## Gene Expression
1. Transcription: DNA → RNA
2. Translation: RNA → Protein

### The Genetic Code
- Codons: Three-nucleotide sequences
- Start codon: AUG
- Stop codons: UAA, UAG, UGA

## Inheritance Patterns
- Dominant and recessive alleles
- Mendelian inheritance
- Punnett squares
- Incomplete dominance and codominance
- Sex-linked traits

## Mutations
- Point mutations
- Insertions and deletions
- Chromosomal mutations
- Effects on phenotype

## Genetic Engineering
- PCR (Polymerase Chain Reaction)
- CRISPR/Cas9 genome editing
- Genetic screening
- Gene therapy approaches
`,

  "computer-science-algorithms": `# Algorithms and Data Structures

## Time and Space Complexity
- Big O notation
- Common complexities:
  - O(1): Constant time
  - O(log n): Logarithmic time
  - O(n): Linear time
  - O(n log n): Linearithmic time
  - O(n²): Quadratic time
  - O(2^n): Exponential time

## Sorting Algorithms
- Bubble Sort: O(n²)
- Selection Sort: O(n²)
- Insertion Sort: O(n²)
- Merge Sort: O(n log n)
- Quick Sort: O(n log n) average case
- Heap Sort: O(n log n)

## Search Algorithms
- Linear Search: O(n)
- Binary Search: O(log n)
- Depth-First Search (DFS)
- Breadth-First Search (BFS)

## Data Structures
1. Arrays and Linked Lists
2. Stacks and Queues
3. Trees
   - Binary Search Trees
   - AVL Trees
   - Red-Black Trees
4. Heaps
5. Hash Tables
6. Graphs

## Dynamic Programming
- Memoization
- Tabulation
- Common problems:
  - Fibonacci sequence
  - Longest common subsequence
  - Knapsack problem
`,
};

// Mock favorite topics
export const initialFavorites = ["math-calculus", "chemistry-organic"];

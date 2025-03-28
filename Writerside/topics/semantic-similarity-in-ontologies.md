# Semantic Similarity in Ontologies

A primary feature of the biomedical term service is to provide semantic similarity query capabilities within ontologies. This feature powers the subject-level query in Cafe Variome 3, allowing a subject to be returned based on how similar it is to the search query, effectively mitigating the issue where patients are annotated with different terms for the same condition.

## Semantic Similarity Model

The semantic similarity algorithm used in the system is the Relevance method, proposed by Schlicker et al. in 2006 _(Schlicker, A., Domingues, F.S., Rahnenführer, J. et al. A new measure for functional similarity of gene products based on Gene Ontology. BMC Bioinformatics 7, 302 (2006). https://doi.org/10.1186/1471-2105-7-302)_. Small adjustment have been made to accelerate the calculation, but the core concept remains the same.

By default, the Resnik Information Content ($IC_{Resnik}$) of a term is defined as:

$$ IC_{Resnik}(t) = - \log\left(p(t)\right) $$

Where $p(t)$ is the probability of a term $t$ appearing in the corpus. The corpus is another term set used to annotate the terms, and the probability is calculated as:

$$ p(t) = \frac{N(t)}{N} $$

Where $N(t)$ reflects the number of annotations of term $t$, and $N$ is the total number of annotations in the corpus. However, in this implementation, the $N$ is not the total number of annotation, but the sum of annotations on the nodes, propagating from the leaves to the root. Consider the following DAG:

<img src="gn-sample-dag-for-ic.svg" alt="Sample DAG for IC"/>

Where the number on each node represents the number of annotations on that node. The total annotation count in the diagram is:

$$ N = 10 + 5 + 7 + 4 = 26 $$

However, to speed up calculation, and represent the multi-inheritance nature of the ontology, $N$ is calculated as:

$$\begin{eqnarray}
N_D &=& 4   \\
N_B &=& 5 + 4 = 9 \\
N_C &=& 7 + 4 = 11 \\
N = N_A &=& 9 + 11 + 10 = 30
\end{eqnarray}$$

This is because D has 2 ancestors, so the annotation count is added to both B and C.

Based on the IC calculation, the Lin's similarity between to terms $t_1$ and $t_2$ is defined as:

$$ Sim_{Lin}\left(t_1, t_2\right) = \frac{2 \times IC(MICA(t_1, t_2))}{IC(t_1) + IC(t_2)} $$

Where $MICA(t_1, t_2)$ is the most informative common ancestor of $t_1$ and $t_2$. The Relevance method has one extra relevance factor:

$$ Sim_{Rel}\left(t_1, t_2\right) = Sim_{Lin}\left(t_1, t_2\right) \times \left( 1 - p\left(MICA(t_1, t_2)\right) \right) $$

This value is pre-calculated and stored in Neo4j for fast retrieval. However, most similarity scores are close to 0, and similarity scores below 0.2 are not stored. Therefore, if a query involves a term pair with a similarity score below 0.2, the system will not return those terms. It is recommended to limit the similarity to above 0.6, otherwise a large number of terms will be returned.

## Corpus Usage and Intrinsic IC

Because the ontologies loaded into the system have more than one annotating corpus, we selected the following annotation for each ontology:

- <tooltip term="HPO">HPO</tooltip>: Gene-Phenotype annotation from the <tooltip term="HPO">HPO</tooltip> consortium

For the ontologies that do not have an annotation or mapping that is of good quality for similarity calculation, intrinsic IC is used. The intrinsic IC considers only the topological structure of the ontology, and the ontology itself. The intrinsic IC used in the system is proposed by Sanchez et al. in 2011 _(Sánchez D, Batet M, Isern D. Ontology-based information content computation. Knowledge-Based Syst 2011;24:297–303.)_, calculated as:

$$ IC_{Sanchez}(t) = - \log\left(\frac{\frac{|leaves(t)|}{|A(t)|} + 1}{MaxLeaves + 1}\right) $$

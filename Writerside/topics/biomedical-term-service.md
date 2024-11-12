# Biomedical Term Service

Cafe Variome Biomedical Term Service (CV-BTS or BTS) is a web API service that provides various functionalities related to biomedical terms, including:

- Autocomplete for terms
- Parent-child traversal for terms (expansion)
- Mapping between term systems
- Semantic similarity between terms

## License and disclaimer

CV-BTS is licensed under the MIT License. You should have received a copy of the MIT License along with this program. If not, see [MIT License](https://opensource.org/licenses/MIT) or below:

> Copyright (c) 2024 CafeVariomeUoL
>
> Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:
>
> The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
>
> THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
> {style="note"}

The data being downloaded or used by CV-BTS are not generated, validated or distributed in any form by Cafe Variome. They should be downloaded from the respective sources, under their own licenses and terms of use. Their authors do not endorse or support CV-BTS in any way. When downloading and using the data, ensure that you comply with the terms of use of the respective data sources and the local laws. For questions regarding the data, please contact the respective data sources.

## Features and roadmap

The currently implemented features are:

- Downloading and parsing of biomedical term sets
    - HPO
    - OMIM
    - NCIT
    - ORDO (Orphanet)
    - SNOMED-CT, SNOMED UK Edition, SNOMED UK Drug Extension, SNOMED UK Clinical Extension
    - HGNC symbols and IDs
    - Reactome Pathways
- Auto-completion of terms
- Ontology tree expansion search
- Semantic similarity search
- GraphQL support on querying all data
- A CLI to manage the system
- Prometheus metrics support

The planned features are:

- Adding more term sets:
    - NCBI
    - Ensembl

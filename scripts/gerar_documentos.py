"""Gera os documentos PDF simulados de cada projeto do acervo.

Fluxo:
1. Lê codigo-fonte/assets/data/projects.json.
2. Busca referências reais no OpenAlex (https://openalex.org), uma consulta por
   área de conhecimento, e grava o snapshot em assets/data/referencias.json.
   Se o snapshot já existir, ele é reutilizado (nenhuma chamada à API).
   Use --atualizar-referencias para buscar de novo.
3. Gera um PDF por projeto em codigo-fonte/assets/docs/<id>.pdf.

Uso:
    pip install -r scripts/requirements.txt
    python scripts/gerar_documentos.py [--atualizar-referencias]

O conteúdo textual é montado a partir dos metadados do projeto e serve só para
demonstrar a plataforma; as referências bibliográficas são reais.
"""

import argparse
import json
import time
import unicodedata
import urllib.parse
import urllib.request
from pathlib import Path

from fpdf import FPDF

RAIZ = Path(__file__).resolve().parent.parent
SITE = RAIZ / "codigo-fonte"
PROJETOS = SITE / "assets" / "data" / "projects.json"
REFERENCIAS = SITE / "assets" / "data" / "referencias.json"
SAIDA = SITE / "assets" / "docs"

OPENALEX = "https://api.openalex.org/works"
REFS_POR_AREA = 8
REFS_POR_DOC = 4

AREAS = {
    "frontend": ("Desenvolvimento Front-end", "web accessibility usability evaluation"),
    "backend": ("Desenvolvimento Back-end", "microservices REST API architecture"),
    "mobile": ("Desenvolvimento Mobile", "mobile application development usability"),
    "redes": ("Redes de Computadores", "software defined networking"),
    "banco-dados": ("Banco de Dados", "NoSQL relational database performance"),
    "seguranca": ("Segurança da Informação", "intrusion detection system"),
}

INTRODUCOES = {
    "frontend": "A experiência do usuário é hoje um fator decisivo para a adoção de sistemas web. Interfaces claras, acessíveis e responsivas reduzem a curva de aprendizado e ampliam o alcance das aplicações.",
    "backend": "Sistemas modernos dependem de serviços confiáveis, escaláveis e seguros para integrar dados e regras de negócio. A camada de servidor concentra boa parte da complexidade dessas soluções.",
    "mobile": "O smartphone se tornou o principal ponto de acesso a serviços digitais. Aplicativos móveis precisam lidar com conectividade instável, recursos limitados e expectativas altas de usabilidade.",
    "redes": "A infraestrutura de redes sustenta praticamente todos os serviços digitais. Monitorar, automatizar e proteger essa infraestrutura é essencial para garantir disponibilidade e desempenho.",
    "banco-dados": "O volume de dados produzido pelas organizações cresce continuamente. Modelar, armazenar e consultar essas informações de forma eficiente é um requisito central de qualquer sistema de informação.",
    "seguranca": "Incidentes de segurança geram prejuízos financeiros e de reputação. Práticas de proteção, detecção e resposta precisam fazer parte do ciclo de vida dos sistemas desde a concepção.",
}


# ---------------------------------------------------------------- referências

def buscar_area(area: str, termos: str) -> list[dict]:
    params = {
        "search": termos,
        # Campo 17 = Ciência da Computação; sem isso a busca traz artigos de outras áreas
        "filter": "primary_topic.field.id:17,type:article,has_doi:true,publication_year:2015-2025,cited_by_count:>30",
        "per-page": REFS_POR_AREA,
        "select": "id,display_name,publication_year,doi,authorships,primary_location,open_access",
    }
    url = f"{OPENALEX}?{urllib.parse.urlencode(params)}"
    req = urllib.request.Request(url, headers={"User-Agent": "estudio-de-ideias/1.0"})
    with urllib.request.urlopen(req, timeout=20) as resp:
        dados = json.load(resp)
    return [normalizar_obra(o) for o in dados.get("results", [])]


def normalizar_obra(obra: dict) -> dict:
    autores = [a["author"]["display_name"] for a in obra.get("authorships", [])[:3]]
    fonte = ((obra.get("primary_location") or {}).get("source") or {}).get("display_name")
    return {
        "titulo": obra.get("display_name"),
        "ano": obra.get("publication_year"),
        "autores": autores,
        "mais_autores": len(obra.get("authorships", [])) > 3,
        "fonte": fonte,
        "doi": obra.get("doi"),
        "acesso_aberto": (obra.get("open_access") or {}).get("oa_url"),
        "openalex": obra.get("id"),
    }


def carregar_referencias(atualizar: bool) -> dict:
    if REFERENCIAS.exists() and not atualizar:
        return json.loads(REFERENCIAS.read_text(encoding="utf-8"))["areas"]
    areas = {}
    for chave, (_, termos) in AREAS.items():
        print(f"OpenAlex: buscando referências de '{chave}'...")
        areas[chave] = buscar_area(chave, termos)
        time.sleep(1)  # uma requisição por segundo, sem rajadas
    REFERENCIAS.write_text(
        json.dumps(
            {
                "fonte": "OpenAlex (https://openalex.org), licença CC0",
                "gerado_em": time.strftime("%Y-%m-%d"),
                "areas": areas,
            },
            ensure_ascii=False,
            indent=2,
        ),
        encoding="utf-8",
    )
    return areas


def formatar_referencia(ref: dict) -> str:
    """Referência no estilo ABNT simplificado."""
    def sobrenome(nome: str) -> str:
        partes = nome.split()
        return f"{partes[-1].upper()}, {' '.join(partes[:-1])}" if len(partes) > 1 else nome.upper()

    autores = "; ".join(sobrenome(a) for a in ref["autores"]) or "AUTOR DESCONHECIDO"
    if ref.get("mais_autores"):
        autores += " et al"
    partes = [f"{autores}. {ref['titulo']}."]
    if ref.get("fonte"):
        partes.append(f"{ref['fonte']},")
    partes.append(f"{ref['ano']}.")
    if ref.get("doi"):
        partes.append(f"DOI: {ref['doi'].replace('https://doi.org/', '')}.")
    return " ".join(partes)


# ---------------------------------------------------------------- PDF

AZUL = (24, 90, 219)
TINTA = (10, 25, 49)
CINZA = (91, 102, 118)


def latin1(texto: str) -> str:
    """As fontes padrão do PDF usam Latin-1; troca o que estiver fora disso."""
    trocas = {"‐": "-", "‑": "-", "—": "-", "–": "-", "‘": "'", "’": "'", "“": '"', "”": '"', "…": "..."}
    for de, para in trocas.items():
        texto = texto.replace(de, para)
    try:
        texto.encode("latin-1")
        return texto
    except UnicodeEncodeError:
        normal = unicodedata.normalize("NFKD", texto)
        return "".join(c for c in normal if c.encode("latin-1", "ignore"))


class Documento(FPDF):
    def __init__(self, projeto: dict):
        super().__init__(format="A4")
        self.projeto = projeto
        self.set_margins(22, 22, 22)
        self.set_auto_page_break(True, 24)
        self.set_title(latin1(projeto["title"]))
        self.set_author(latin1(projeto["author"]))
        self.set_creator("Estúdio de Ideias - documento simulado")

    def header(self):
        if self.page_no() == 1:
            return
        self.set_font("Helvetica", "", 8)
        self.set_text_color(*CINZA)
        self.cell(0, 6, latin1(f"Estúdio de Ideias  |  {self.projeto['title']}"), align="L")
        self.ln(10)

    def footer(self):
        self.set_y(-15)
        self.set_font("Helvetica", "", 8)
        self.set_text_color(*CINZA)
        self.cell(0, 6, latin1("Documento simulado para demonstração da plataforma"), align="L")
        self.cell(0, 6, f"{self.page_no()}/{{nb}}", align="R")

    def titulo_secao(self, texto: str):
        self.ln(4)
        self.set_font("Helvetica", "B", 12)
        self.set_text_color(*TINTA)
        self.cell(0, 8, latin1(texto), new_x="LMARGIN", new_y="NEXT")
        self.set_draw_color(*AZUL)
        self.set_line_width(0.6)
        self.line(self.l_margin, self.get_y(), self.l_margin + 18, self.get_y())
        self.ln(3)

    def paragrafo(self, texto: str):
        self.set_font("Times", "", 11.5)
        self.set_text_color(30, 30, 30)
        self.multi_cell(0, 6.2, latin1(texto), align="J", new_x="LMARGIN", new_y="NEXT")
        self.ln(2)


def gerar_pdf(pid: str, p: dict, refs: list[dict]) -> None:
    area_nome = AREAS.get(p["area"], (p["area"], ""))[0]
    techs = p.get("technologies", [])
    techs_txt = ", ".join(techs[:-1]) + f" e {techs[-1]}" if len(techs) > 1 else "".join(techs)

    doc = Documento(p)
    doc.alias_nb_pages()

    # Capa
    doc.add_page()
    doc.set_fill_color(*TINTA)
    doc.rect(0, 0, 210, 60, "F")
    doc.set_fill_color(*AZUL)
    doc.rect(0, 60, 210, 2.5, "F")
    doc.set_xy(22, 22)
    doc.set_font("Helvetica", "B", 11)
    doc.set_text_color(255, 255, 255)
    doc.cell(0, 6, latin1("ESTÚDIO DE IDEIAS"), new_x="LMARGIN", new_y="NEXT")
    doc.set_font("Helvetica", "", 9)
    doc.set_text_color(160, 174, 192)
    doc.cell(0, 6, latin1("Acervo acadêmico  ·  Análise e Desenvolvimento de Sistemas"), new_x="LMARGIN", new_y="NEXT")

    doc.set_y(90)
    doc.set_font("Helvetica", "", 9)
    doc.set_text_color(*AZUL)
    doc.cell(0, 6, latin1(area_nome.upper()), new_x="LMARGIN", new_y="NEXT")
    doc.ln(2)
    doc.set_font("Helvetica", "B", 22)
    doc.set_text_color(*TINTA)
    doc.multi_cell(0, 10, latin1(p["title"]), new_x="LMARGIN", new_y="NEXT")
    doc.ln(6)
    doc.set_font("Helvetica", "", 12)
    doc.set_text_color(*CINZA)
    doc.cell(0, 7, latin1(p["author"]), new_x="LMARGIN", new_y="NEXT")

    doc.set_y(220)
    doc.set_draw_color(226, 232, 240)
    doc.set_line_width(0.3)
    doc.line(22, doc.get_y(), 188, doc.get_y())
    doc.ln(4)
    for rotulo, valor in (("Ano", str(p["year"])), ("Área", area_nome), ("Tecnologias", ", ".join(techs))):
        doc.set_font("Helvetica", "B", 9)
        doc.set_text_color(*TINTA)
        doc.cell(28, 6, latin1(rotulo))
        doc.set_font("Helvetica", "", 9)
        doc.set_text_color(*CINZA)
        doc.multi_cell(0, 6, latin1(valor), new_x="LMARGIN", new_y="NEXT")
    doc.ln(4)
    doc.set_font("Helvetica", "I", 8)
    doc.multi_cell(
        0, 5,
        latin1("Documento simulado: o texto foi gerado a partir dos metadados do projeto para demonstrar a plataforma. As referências bibliográficas são reais (OpenAlex)."),
        new_x="LMARGIN", new_y="NEXT",
    )

    # Corpo
    doc.add_page()
    doc.titulo_secao("Resumo")
    doc.paragrafo(p["summary"])
    doc.set_font("Helvetica", "B", 9)
    doc.set_text_color(*TINTA)
    doc.cell(26, 6, "Palavras-chave:")
    doc.set_font("Helvetica", "", 9)
    doc.set_text_color(*CINZA)
    doc.multi_cell(0, 6, latin1("; ".join([area_nome] + techs) + "."), new_x="LMARGIN", new_y="NEXT")

    citacoes = [f"{(r['autores'][0].split()[-1] if r['autores'] else 'Autor')} ({r['ano']})" for r in refs]

    doc.titulo_secao("1  Introdução")
    doc.paragrafo(INTRODUCOES.get(p["area"], ""))
    doc.paragrafo(
        f"Nesse contexto, este trabalho apresenta o projeto \"{p['title']}\". "
        f"{p['summary']} A literatura da área, como {citacoes[0]} e {citacoes[1]}, "
        "reforça a relevância do tema e orienta as decisões tomadas ao longo do desenvolvimento."
    )

    doc.titulo_secao("2  Objetivos")
    doc.paragrafo(
        f"O objetivo geral é entregar uma solução funcional na área de {area_nome.lower()}, validada com usuários e documentada "
        "para que possa ser reutilizada por outros estudantes. Como objetivos específicos, o trabalho busca levantar requisitos "
        "com o público-alvo, construir um protótipo incremental, avaliar a solução com métricas objetivas e registrar as lições aprendidas."
    )

    doc.titulo_secao("3  Metodologia")
    doc.paragrafo(
        f"O desenvolvimento seguiu um processo iterativo, com ciclos curtos de planejamento, implementação e revisão. "
        f"A solução foi construída com {techs_txt}, escolhidas pela maturidade do ecossistema e pela familiaridade da equipe. "
        f"Os procedimentos de avaliação se basearam em trabalhos de referência, como {citacoes[2]}."
    )

    doc.titulo_secao("4  Resultados")
    doc.paragrafo(
        "O protótipo final atendeu aos requisitos levantados e foi avaliado em sessões de teste com usuários. "
        f"O trabalho recebeu {p.get('citations', 0)} citações na plataforma Estúdio de Ideias, indicando o interesse de outros "
        "estudantes pelo tema e pela abordagem adotada."
    )

    doc.titulo_secao("5  Conclusão")
    doc.paragrafo(
        "O projeto demonstrou a viabilidade da proposta e deixa caminhos para trabalhos futuros, como a ampliação dos testes, "
        f"a integração com outros sistemas e o aprofundamento da análise à luz de estudos como {citacoes[3]}."
    )

    doc.titulo_secao("Referências")
    doc.set_font("Times", "", 10)
    doc.set_text_color(30, 30, 30)
    for ref in sorted(refs, key=lambda r: r["autores"][0].split()[-1] if r["autores"] else ""):
        doc.multi_cell(0, 5.2, latin1(formatar_referencia(ref)), new_x="LMARGIN", new_y="NEXT")
        doc.ln(2)

    doc.output(str(SAIDA / f"{pid}.pdf"))


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--atualizar-referencias", action="store_true", help="busca as referências de novo no OpenAlex")
    args = parser.parse_args()

    projetos = json.loads(PROJETOS.read_text(encoding="utf-8"))
    referencias = carregar_referencias(args.atualizar_referencias)
    SAIDA.mkdir(parents=True, exist_ok=True)

    for indice, (pid, projeto) in enumerate(projetos.items()):
        pool = [r for r in referencias.get(projeto["area"], []) if r["autores"]]
        # Rotaciona o conjunto para que projetos da mesma área citem combinações diferentes
        refs = [pool[(indice + i) % len(pool)] for i in range(REFS_POR_DOC)]
        gerar_pdf(pid, projeto, refs)

    print(f"{len(projetos)} PDFs gerados em {SAIDA.relative_to(RAIZ)}")


if __name__ == "__main__":
    main()

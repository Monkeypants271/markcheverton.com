"""Build a seven-page printable teaching guide from the editable StoryDogs data.

node --import tsx scripts/export-storydogs-teacher-guide.ts > /tmp/storydogs-guide.json
python scripts/build-storydogs-teacher-guide.py /tmp/storydogs-guide.json output/pdf/storydogs-teacher-guide.pdf
Requires reportlab. No dependencies are used by the website at runtime.
"""
import json
import sys
from pathlib import Path
from xml.sax.saxutils import escape

from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak


def text(value):
    return escape(value.replace("—", "-").replace("–", "-").replace("…", "..."))


source, destination = map(Path, sys.argv[1:3])
stages = json.loads(source.read_text())
destination.parent.mkdir(parents=True, exist_ok=True)
plum = colors.HexColor("#50314d")
styles = {
    "title": ParagraphStyle("Title", fontName="Helvetica-Bold", fontSize=19, leading=24, spaceAfter=9),
    "stage": ParagraphStyle("Stage", fontName="Helvetica-Bold", fontSize=16, leading=21, textColor=plum, spaceAfter=10),
    "heading": ParagraphStyle("Heading", fontName="Helvetica-Bold", fontSize=11, leading=14, textColor=plum, spaceBefore=12, spaceAfter=5, keepWithNext=True),
    "body": ParagraphStyle("Body", fontName="Helvetica", fontSize=10.5, leading=14, spaceAfter=5, alignment=TA_LEFT),
    "note": ParagraphStyle("Note", fontName="Helvetica", fontSize=9, leading=12, textColor=colors.HexColor("#504850"), spaceAfter=5),
}
story = []
note = "Use these questions as conversation starters. For younger writers, invite a spoken answer or a drawing first; an adult can help record their words. Keep the student's choices at the heart of the story."


def paragraph(value, style="body"):
    story.append(Paragraph(text(value), styles[style]))


for index, stage in enumerate(stages):
    if index:
        story.append(PageBreak())
    paragraph("StoryDogs Teaching Guide", "title")
    paragraph(f"Step {index + 1}: {stage['label']} - {stage['title']}", "stage")
    if index == 0:
        paragraph("Keep these pages beside you during a classroom, library, or author-led activity. Each page explains one step, offers wording you can say aloud, and helps you build on students' answers without choosing their story for them.", "note")
        paragraph(stage["classroomIntroduction"], "note")
    help_text = stage["help"]
    paragraph("What this step does", "heading")
    paragraph(help_text["purpose"])
    paragraph("The two student questions", "heading")
    for number, question in enumerate(stage["questions"], 1):
        paragraph(f"{number}. {question}")
    paragraph("You might say", "heading")
    paragraph(help_text["teacherScript"])
    paragraph("Listen for and help them go further", "heading")
    paragraph(help_text["listenFor"])
    paragraph("Questions to keep the conversation moving", "heading")
    for question in help_text["questions"]:
        paragraph("- " + question)
    paragraph("Follow Pip's connected example", "heading")
    paragraph(help_text["example"])
    story.append(Spacer(1, 8))
    paragraph(note, "note")


def footer(canvas, document):
    canvas.saveState()
    canvas.setFont("Helvetica", 9)
    canvas.setFillColor(colors.HexColor("#504850"))
    canvas.drawString(48, 30, "MarkCheverton.com  |  StoryDogs")
    canvas.drawRightString(letter[0] - 48, 30, f"{document.page} / 7")
    canvas.restoreState()


SimpleDocTemplate(str(destination), pagesize=letter, leftMargin=48, rightMargin=48, topMargin=42, bottomMargin=46, title="StoryDogs Teaching Guide", author="Mark Cheverton").build(story, onFirstPage=footer, onLaterPages=footer)

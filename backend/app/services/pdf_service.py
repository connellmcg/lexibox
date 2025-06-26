import PyPDF2
import os

def extract_text_from_pdf(file_path: str) -> str:
    """
    Extract text from a PDF file using PyPDF2
    """
    try:
        with open(file_path, 'rb') as file:
            pdf_reader = PyPDF2.PdfReader(file)
            if pdf_reader.is_encrypted:
                raise Exception("This PDF is password-protected and cannot be processed.")
            text = ""
            
            for page in pdf_reader.pages:
                text += page.extract_text() + "\n"
            
            return text.strip()
    except Exception as e:
        raise Exception(f"Error extracting text from PDF: {str(e)}")

def is_valid_pdf(file_path: str) -> bool:
    """
    Check if a file is a valid PDF
    """
    try:
        with open(file_path, 'rb') as file:
            PyPDF2.PdfReader(file)
        return True
    except:
        return False

def get_file_size(file_path: str) -> int:
    """Get file size in bytes"""
    return os.path.getsize(file_path) 
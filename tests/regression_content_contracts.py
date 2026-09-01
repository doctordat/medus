from pathlib import Path
from urllib.parse import urlparse
import re

ROOT = Path(__file__).parents[1]
LEARN = (ROOT / 'assets/learn-public.js').read_text()
RES = (ROOT / 'admin/resources/index.html').read_text()
CASE = (ROOT / 'cases/index.html').read_text()
REVIEW = (ROOT / 'admin/review-assessments/index.html').read_text()


def safe_resource_url(url, kind):
    try:
        u = urlparse(url)
        if kind == 'internal_link':
            return u.scheme in ('http', 'https') and u.netloc == 'example.test' and u.path.startswith('/medus/')
        return u.scheme == 'https' and bool(u.netloc)
    except Exception:
        return False


def valid_resource(r):
    return (bool(r.get('title')) and safe_resource_url(r.get('url', ''), r.get('resource_type', ''))
            and bool(r.get('attribution_license')) and bool(r.get('source_locator'))
            and (r.get('resource_type') != 'image' or bool(r.get('alt_text'))))


def valid_case(steps):
    orders = [x.get('step_order') for x in steps]
    return 3 <= len(steps) <= 5 and orders == list(range(1, len(steps) + 1)) and all(x.get('section_key') and x.get('competency') for x in steps)


def main():
    assert safe_resource_url('https://cdn.example/image.png', 'image')
    assert safe_resource_url('https://youtu.be/EfpEu86BqRI', 'youtube')
    assert not safe_resource_url('http://cdn.example/image.png', 'image')
    assert not safe_resource_url('javascript:alert(1)', 'external_link')
    assert safe_resource_url('https://example.test/medus/hoc/', 'internal_link')
    assert not safe_resource_url('https://evil.test/medus/hoc/', 'internal_link')
    good = {'title':'Diagram','url':'https://cdn.example/x.png','resource_type':'image','alt_text':'Diagram','attribution_license':'CC BY','source_locator':'page 3'}
    assert valid_resource(good)
    assert not valid_resource({**good, 'alt_text':''})
    assert not valid_resource({**good, 'source_locator':''})
    steps = [{'step_order':i,'section_key':k,'competency':'management'} for i,k in enumerate(['safety_gate','investigations','decision_points'], 1)]
    assert valid_case(steps)
    assert not valid_case([{**x, 'step_order':2} for x in steps])
    assert not valid_case(steps[:2])
    assert "medical_review_status','published" in LEARN
    assert "eq('access_level','public')" in LEARN
    assert 'clinical_problem_resources' in LEARN
    extractor = (ROOT / 'admin/index.html').read_text()
    assert 'Math.abs(l.y-it.y)<=2' in extractor
    assert "join('\\n')" in extractor
    assert 'getTextContent' in extractor
    assert 'medical_review_status' in RES and "status:'draft'" in RES
    assert ".eq('status','published')" in CASE
    assert 'case_attempts' in CASE
    assert 'Approve → Review' in REVIEW and 'Publish' in REVIEW
    assert 'NEEDS PROVENANCE' in REVIEW
    print('Content regression suite passed: URL safety, resource provenance, 3-step case contract, published-only Learn and review gates.')


if __name__ == '__main__':
    main()

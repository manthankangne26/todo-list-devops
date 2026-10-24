
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


class TodoAppTests(unittest.TestCase):

    def test_required_files_exist(self):
        for filename in ("index.html", "style.css", "script.js"):
            with self.subTest(filename=filename):
                self.assertTrue((ROOT / filename).is_file())

    def test_html_loads_css_and_javascript(self):
        html = (ROOT / "index.html").read_text(encoding="utf-8")
        self.assertIn('href="style.css"', html)
        self.assertIn('src="script.js"', html)

    def test_task_features_exist(self):
        js = (ROOT / "script.js").read_text(encoding="utf-8")
        self.assertIn("localStorage", js)
        self.assertIn("renderTasks", js)
        self.assertIn("clearCompleted", js)
        self.assertIn("deleteButton", js)


if __name__ == "__main__":
    unittest.main()

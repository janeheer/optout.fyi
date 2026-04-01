"""
OptOut Flask application.

This server only renders static pages and template shells.
All letter generation, countdown tracking, and complaint drafting happen
in browser-side JavaScript so no personal information is collected by
the server.
"""

from flask import Flask, render_template


app = Flask(__name__)


@app.route("/")
def index():
    """Main letter generator page."""
    return render_template(
        "index.html",
        page_title="OptOut - Immigrant Data Rights",
        page_shell_class="max-w-6xl",
    )


@app.route("/guide")
def guide():
    """Guide page with rights explanations and complaint tools."""
    return render_template("guide.html", page_title="Legal Guide - OptOut")


@app.route("/resources")
def resources():
    """Resources page with further reading and advocacy links."""
    return render_template("resources.html", page_title="Resources - OptOut")


if __name__ == "__main__":
    app.run(debug=True, host="127.0.0.1", port=5000)

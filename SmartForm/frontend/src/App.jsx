import { useState } from "react";
import "./index.css";

const questionTypes = [
  "Short Answer",
  "Paragraph",
  "Email",
  "Phone",
  "Number",
  "Dropdown",
  "Multiple Choice",
  "Checkboxes",
  "Date",
  "File Upload",
];

function App() {
  const [page, setPage] = useState("home");

  const [formTitle, setFormTitle] = useState("Create your form");
  const [formDescription, setFormDescription] = useState(
    "Build a form and collect responses in one place."
  );

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});

  // Published form information
  const [published, setPublished] = useState(false);
  const [formId, setFormId] = useState("");
  const [publicLink, setPublicLink] = useState("");

  // -----------------------------
  // CREATE FORM
  // -----------------------------

  const createForm = () => {
    setPage("builder");
  };

  // -----------------------------
  // ADD QUESTION
  // -----------------------------

  const addQuestion = () => {
    const newQuestion = {
      id: Date.now(),
      question: "",
      type: "Short Answer",
      required: false,
      options: ["Option 1", "Option 2"],
    };

    setQuestions((prev) => [...prev, newQuestion]);
  };

  // -----------------------------
  // UPDATE QUESTION
  // -----------------------------

  const updateQuestion = (id, field, value) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === id
          ? {
              ...q,
              [field]: value,
            }
          : q
      )
    );
  };

  // -----------------------------
  // DELETE QUESTION
  // -----------------------------

  const deleteQuestion = (id) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  // -----------------------------
  // ADD OPTION
  // -----------------------------

  const addOption = (questionId) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId
          ? {
              ...q,
              options: [
                ...q.options,
                `Option ${q.options.length + 1}`,
              ],
            }
          : q
      )
    );
  };

  // -----------------------------
  // UPDATE OPTION
  // -----------------------------

  const updateOption = (questionId, optionIndex, value) => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id !== questionId) return q;

        const updatedOptions = [...q.options];
        updatedOptions[optionIndex] = value;

        return {
          ...q,
          options: updatedOptions,
        };
      })
    );
  };

  // -----------------------------
  // DELETE OPTION
  // -----------------------------

  const deleteOption = (questionId, optionIndex) => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id !== questionId) return q;

        return {
          ...q,
          options: q.options.filter(
            (_, index) => index !== optionIndex
          ),
        };
      })
    );
  };

  // -----------------------------
  // PREVIEW
  // -----------------------------

  const openPreview = () => {
    if (!formTitle.trim()) {
      alert("Please enter a form title.");
      return;
    }

    if (questions.length === 0) {
      alert("Please add at least one question.");
      return;
    }

    setAnswers({});
    setPage("preview");
  };

  // -----------------------------
  // ANSWERS
  // -----------------------------

  const updateAnswer = (questionId, value) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  // -----------------------------
  // SUBMIT FORM
  // -----------------------------

  const submitForm = () => {
    const missingRequired = questions.some((q) => {
      if (!q.required) return false;

      const answer = answers[q.id];

      if (Array.isArray(answer)) {
        return answer.length === 0;
      }

      return !answer || answer.toString().trim() === "";
    });

    if (missingRequired) {
      alert("Please complete all required fields.");
      return;
    }

    console.log("Submitted Response:", answers);

    alert(
      "🎉 Response submitted successfully!\n\nYour response has been received."
    );

    setAnswers({});
  };

  // =========================================================
  // PUBLISH FORM
  // =========================================================

  const publishForm = () => {
    if (!formTitle.trim()) {
      alert("Please enter a form title.");
      return;
    }

    if (questions.length === 0) {
      alert("Please add at least one question before publishing.");
      return;
    }

    // Generate a short unique ID
    const randomPart = Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase();

    const generatedId = `SF-${randomPart}`;

    const generatedLink = `${window.location.origin}/form/${randomPart}`;

    setFormId(generatedId);
    setPublicLink(generatedLink);
    setPublished(true);
    setPage("published");
  };

  // -----------------------------
  // COPY LINK
  // -----------------------------

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(publicLink);
      alert("🔗 Form link copied!");
    } catch (error) {
      alert("Unable to copy automatically. Please copy the link manually.");
    }
  };

  // -----------------------------
  // UNPUBLISH
  // -----------------------------

  const unpublishForm = () => {
    const confirmed = window.confirm(
      "Are you sure you want to unpublish this form?"
    );

    if (!confirmed) return;

    setPublished(false);
    setPage("builder");
  };

  // =========================================================
  // HOME
  // =========================================================

  if (page === "home") {
    return (
      <div className="app">
        <nav className="navbar">
          <div className="logo">
            Smart<span>Form</span>
          </div>

          <div className="nav-links">
            <button onClick={() => setPage("home")}>
              Home
            </button>

            <button onClick={createForm}>
              Forms
            </button>

            <button
              onClick={() =>
                document
                  .getElementById("dashboard")
                  ?.scrollIntoView({
                    behavior: "smooth",
                  })
              }
            >
              Dashboard
            </button>

            <button
              className="login-btn"
              onClick={() =>
                alert("Admin Login coming next!")
              }
            >
              Admin Login
            </button>
          </div>
        </nav>

        <section className="hero">
          <div className="hero-content">
            <div className="badge">
              SMART DATA COLLECTION PLATFORM
            </div>

            <h1>
              Create Forms.
              <br />
              <span>Collect Smarter.</span>
            </h1>

            <p>
              Build powerful forms, collect responses, manage
              data and generate insights — all in one simple
              platform.
            </p>

            <div className="hero-buttons">
              <button
                className="primary-btn"
                onClick={createForm}
              >
                + Create a Form
              </button>

              <button
                className="secondary-btn"
                onClick={() =>
                  document
                    .getElementById("dashboard")
                    ?.scrollIntoView({
                      behavior: "smooth",
                    })
                }
              >
                Explore Dashboard →
              </button>
            </div>
          </div>

          <div className="hero-card">
            <div className="card-header">
              <span>SMARTFORM</span>
              <span>● LIVE</span>
            </div>

            <div className="mini-form">
              <div className="mini-line large"></div>
              <div className="mini-line"></div>
              <div className="mini-input"></div>

              <div className="mini-line"></div>
              <div className="mini-input"></div>

              <div className="mini-line"></div>

              <div className="mini-options">
                <span></span>
                <span></span>
                <span></span>
              </div>

              <div className="mini-submit">
                SUBMIT RESPONSE
              </div>
            </div>
          </div>
        </section>

        <section className="features">
          <div className="section-heading">
            <span>WHY SMARTFORM?</span>

            <h2>
              Everything you need to collect data
            </h2>
          </div>

          <div className="feature-grid">
            <div className="feature-card">
              <div className="feature-icon">⚡</div>

              <h3>Easy Form Builder</h3>

              <p>
                Create professional forms using different
                question types.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">📊</div>

              <h3>Smart Dashboard</h3>

              <p>
                View responses, statistics and important
                information from one dashboard.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🔐</div>

              <h3>Secure Data</h3>

              <p>
                Keep collected information organized and
                protected.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">📁</div>

              <h3>Export Data</h3>

              <p>
                Export collected responses into
                spreadsheet-friendly formats.
              </p>
            </div>
          </div>
        </section>

        <section
          className="dashboard-preview"
          id="dashboard"
        >
          <div className="section-heading">
            <span>DASHBOARD PREVIEW</span>

            <h2>Your data. One place.</h2>
          </div>

          <div className="dashboard-card">
            <div className="dashboard-top">
              <div>
                <small>TOTAL RESPONSES</small>
                <strong>1,248</strong>
              </div>

              <div>
                <small>ACTIVE FORMS</small>
                <strong>12</strong>
              </div>

              <div>
                <small>THIS WEEK</small>
                <strong>+18.4%</strong>
              </div>
            </div>

            <div className="fake-chart">
              <div style={{ height: "35%" }}></div>
              <div style={{ height: "55%" }}></div>
              <div style={{ height: "45%" }}></div>
              <div style={{ height: "75%" }}></div>
              <div style={{ height: "60%" }}></div>
              <div style={{ height: "90%" }}></div>
              <div style={{ height: "72%" }}></div>
            </div>
          </div>
        </section>

        <section className="cta">
          <h2>Ready to collect smarter?</h2>

          <p>
            Create your first SmartForm and move beyond
            traditional spreadsheets.
          </p>

          <button
            className="primary-btn"
            onClick={createForm}
          >
            Create Your First Form →
          </button>
        </section>

        <footer>
          <div className="logo">
            Smart<span>Form</span>
          </div>

          <p>Smart data collection for everyone.</p>

          <span>© 2026 SmartForm</span>
        </footer>
      </div>
    );
  }

  // =========================================================
  // BUILDER
  // =========================================================

  if (page === "builder") {
    return (
      <div className="builder-page">
        <nav className="builder-navbar">
          <div className="logo">
            Smart<span>Form</span>
          </div>

          <div className="builder-actions">
            <button
              className="back-btn"
              onClick={() => setPage("home")}
            >
              ← Back
            </button>

            <button
              className="preview-btn"
              onClick={openPreview}
            >
              👁 Preview
            </button>

            <button
              className="publish-btn"
              onClick={publishForm}
            >
              🚀 Publish Form
            </button>
          </div>
        </nav>

        <main className="builder-container">
          <div className="builder-heading">
            <div>
              <span>FORM BUILDER</span>

              <h1>Create your form</h1>

              <p>
                Build a form and collect responses in one place.
              </p>
            </div>

            <div className="question-count">
              <strong>{questions.length}</strong>

              <span>Questions</span>
            </div>
          </div>

          <section className="form-settings">
            <label>Form Title</label>

            <input
              type="text"
              value={formTitle}
              onChange={(e) =>
                setFormTitle(e.target.value)
              }
              placeholder="Enter form title"
            />

            <label>Description</label>

            <textarea
              value={formDescription}
              onChange={(e) =>
                setFormDescription(e.target.value)
              }
              placeholder="Describe your form"
              rows="3"
            />
          </section>

          <div className="questions-heading">
            <div>
              <span>QUESTIONS</span>

              <h2>
                {questions.length} Questions
              </h2>
            </div>

            <button
              className="add-question-btn"
              onClick={addQuestion}
            >
              + Add Question
            </button>
          </div>

          {questions.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">＋</div>

              <h2>No questions yet</h2>

              <p>
                Start building your form by adding your
                first question.
              </p>

              <button
                className="primary-btn"
                onClick={addQuestion}
              >
                + Add First Question
              </button>
            </div>
          ) : (
            <div className="questions-list">
              {questions.map((q, index) => (
                <div
                  className="question-card"
                  key={q.id}
                >
                  <div className="question-card-top">
                    <span className="question-number">
                      {index + 1}
                    </span>

                    <button
                      className="delete-btn"
                      onClick={() =>
                        deleteQuestion(q.id)
                      }
                    >
                      🗑
                    </button>
                  </div>

                  <label>Question</label>

                  <input
                    className="question-input"
                    type="text"
                    value={q.question}
                    onChange={(e) =>
                      updateQuestion(
                        q.id,
                        "question",
                        e.target.value
                      )
                    }
                    placeholder="Enter your question"
                  />

                  <div className="question-controls">
                    <div>
                      <label>Question Type</label>

                      <select
                        value={q.type}
                        onChange={(e) =>
                          updateQuestion(
                            q.id,
                            "type",
                            e.target.value
                          )
                        }
                      >
                        {questionTypes.map((type) => (
                          <option
                            key={type}
                            value={type}
                          >
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>

                    <label className="required-control">
                      <input
                        type="checkbox"
                        checked={q.required}
                        onChange={(e) =>
                          updateQuestion(
                            q.id,
                            "required",
                            e.target.checked
                          )
                        }
                      />

                      Required
                    </label>
                  </div>

                  {(q.type === "Dropdown" ||
                    q.type === "Multiple Choice" ||
                    q.type === "Checkboxes") && (
                    <div className="options-editor">
                      <label>Options</label>

                      {q.options.map(
                        (option, optionIndex) => (
                          <div
                            className="option-row"
                            key={optionIndex}
                          >
                            <span>
                              {q.type ===
                              "Multiple Choice"
                                ? "○"
                                : q.type ===
                                  "Checkboxes"
                                ? "☐"
                                : "•"}
                            </span>

                            <input
                              type="text"
                              value={option}
                              onChange={(e) =>
                                updateOption(
                                  q.id,
                                  optionIndex,
                                  e.target.value
                                )
                              }
                            />

                            {q.options.length > 1 && (
                              <button
                                onClick={() =>
                                  deleteOption(
                                    q.id,
                                    optionIndex
                                  )
                                }
                              >
                                ×
                              </button>
                            )}
                          </div>
                        )
                      )}

                      <button
                        className="add-option-btn"
                        onClick={() =>
                          addOption(q.id)
                        }
                      >
                        + Add Option
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {questions.length > 0 && (
            <button
              className="add-another-btn"
              onClick={addQuestion}
            >
              + Add Another Question
            </button>
          )}
        </main>
      </div>
    );
  }

  // =========================================================
  // PREVIEW
  // =========================================================

  if (page === "preview") {
    return (
      <div className="preview-page">
        <nav className="preview-navbar">
          <div className="logo">
            Smart<span>Form</span>
          </div>

          <div className="preview-nav-actions">
            <button
              onClick={() => setPage("builder")}
              className="back-btn"
            >
              ← Back to Builder
            </button>
          </div>
        </nav>

        <main className="preview-container">
          <div className="preview-badge">
            FORM PREVIEW
          </div>

          <div className="preview-form-card">
            <div className="preview-form-header">
              <h1>{formTitle}</h1>

              <p>{formDescription}</p>
            </div>

            <div className="preview-questions">
              {questions.map((q, index) => (
                <div
                  className="preview-question"
                  key={q.id}
                >
                  <label>
                    {index + 1}.{" "}
                    {q.question ||
                      "Untitled Question"}

                    {q.required && (
                      <span className="required-star">
                        *
                      </span>
                    )}
                  </label>

                  {q.type === "Short Answer" && (
                    <input
                      type="text"
                      placeholder="Your answer"
                      value={answers[q.id] || ""}
                      onChange={(e) =>
                        updateAnswer(
                          q.id,
                          e.target.value
                        )
                      }
                    />
                  )}

                  {q.type === "Email" && (
                    <input
                      type="email"
                      placeholder="example@email.com"
                      value={answers[q.id] || ""}
                      onChange={(e) =>
                        updateAnswer(
                          q.id,
                          e.target.value
                        )
                      }
                    />
                  )}

                  {q.type === "Phone" && (
                    <input
                      type="tel"
                      placeholder="Enter phone number"
                      value={answers[q.id] || ""}
                      onChange={(e) =>
                        updateAnswer(
                          q.id,
                          e.target.value
                        )
                      }
                    />
                  )}

                  {q.type === "Number" && (
                    <input
                      type="number"
                      placeholder="Enter number"
                      value={answers[q.id] || ""}
                      onChange={(e) =>
                        updateAnswer(
                          q.id,
                          e.target.value
                        )
                      }
                    />
                  )}

                  {q.type === "Paragraph" && (
                    <textarea
                      rows="5"
                      placeholder="Write your answer..."
                      value={answers[q.id] || ""}
                      onChange={(e) =>
                        updateAnswer(
                          q.id,
                          e.target.value
                        )
                      }
                    />
                  )}

                  {q.type === "Date" && (
                    <input
                      type="date"
                      value={answers[q.id] || ""}
                      onChange={(e) =>
                        updateAnswer(
                          q.id,
                          e.target.value
                        )
                      }
                    />
                  )}

                  {q.type === "Dropdown" && (
                    <select
                      value={answers[q.id] || ""}
                      onChange={(e) =>
                        updateAnswer(
                          q.id,
                          e.target.value
                        )
                      }
                    >
                      <option value="">
                        Select an option
                      </option>

                      {q.options.map(
                        (option, optionIndex) => (
                          <option
                            key={optionIndex}
                            value={option}
                          >
                            {option}
                          </option>
                        )
                      )}
                    </select>
                  )}

                  {q.type === "Multiple Choice" && (
                    <div className="choice-group">
                      {q.options.map(
                        (option, optionIndex) => (
                          <label
                            className="choice-item"
                            key={optionIndex}
                          >
                            <input
                              type="radio"
                              name={`question-${q.id}`}
                              value={option}
                              checked={
                                answers[q.id] ===
                                option
                              }
                              onChange={(e) =>
                                updateAnswer(
                                  q.id,
                                  e.target.value
                                )
                              }
                            />

                            <span>{option}</span>
                          </label>
                        )
                      )}
                    </div>
                  )}

                  {q.type === "Checkboxes" && (
                    <div className="choice-group">
                      {q.options.map(
                        (option, optionIndex) => {
                          const currentAnswers =
                            answers[q.id] || [];

                          const checked =
                            currentAnswers.includes(
                              option
                            );

                          return (
                            <label
                              className="choice-item"
                              key={optionIndex}
                            >
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={() => {
                                  let updated;

                                  if (checked) {
                                    updated =
                                      currentAnswers.filter(
                                        (item) =>
                                          item !== option
                                      );
                                  } else {
                                    updated = [
                                      ...currentAnswers,
                                      option,
                                    ];
                                  }

                                  updateAnswer(
                                    q.id,
                                    updated
                                  );
                                }}
                              />

                              <span>{option}</span>
                            </label>
                          );
                        }
                      )}
                    </div>
                  )}

                  {q.type === "File Upload" && (
                    <div className="file-upload">
                      <input
                        type="file"
                        onChange={(e) =>
                          updateAnswer(
                            q.id,
                            e.target.files?.[0]
                              ?.name || ""
                          )
                        }
                      />

                      {answers[q.id] && (
                        <small>
                          Selected: {answers[q.id]}
                        </small>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="preview-submit">
              <button
                className="primary-btn"
                onClick={submitForm}
              >
                Submit Response →
              </button>
            </div>
          </div>

          <button
            className="edit-form-btn"
            onClick={() => setPage("builder")}
          >
            ✏️ Edit Form
          </button>
        </main>
      </div>
    );
  }

  // =========================================================
  // PUBLISHED PAGE
  // =========================================================

  if (page === "published") {
    return (
      <div className="published-page">
        <nav className="published-navbar">
          <div className="logo">
            Smart<span>Form</span>
          </div>

          <button
            className="back-btn"
            onClick={() => setPage("builder")}
          >
            ← Back to Builder
          </button>
        </nav>

        <main className="published-container">
          <div className="published-card">
            <div className="success-icon">✓</div>

            <div className="published-status">
              ● PUBLISHED
            </div>

            <h1>🎉 Your form is published!</h1>

            <p className="published-description">
              Your form is ready to share. Anyone with the
              public link can access the form.
            </p>

            <div className="form-id-box">
              <span>FORM ID</span>
              <strong>{formId}</strong>
            </div>

            <div className="share-section">
              <label>PUBLIC FORM LINK</label>

              <div className="link-box">
                <input
                  type="text"
                  value={publicLink}
                  readOnly
                />

                <button onClick={copyLink}>
                  📋 Copy
                </button>
              </div>
            </div>

            <div className="qr-section">
              <div className="qr-placeholder">
                <div className="qr-inner">
                  <span>QR</span>
                </div>
              </div>

              <div className="qr-text">
                <h3>Share with QR Code</h3>

                <p>
                  QR code generation will be connected
                  to the real public form in the next step.
                </p>
              </div>
            </div>

            <div className="published-actions">
              <button
                className="primary-btn"
                onClick={() => setPage("preview")}
              >
                👁 Open Form Preview
              </button>

              <button
                className="secondary-btn"
                onClick={copyLink}
              >
                🔗 Copy Public Link
              </button>

              <button
                className="unpublish-btn"
                onClick={unpublishForm}
              >
                Unpublish Form
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return null;
}

export default App;
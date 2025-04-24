use axum::{Router, extract, response, routing::get, routing::post};
use serde::{Deserialize, Serialize};

#[derive(Deserialize, Debug)]
#[allow(dead_code)]
struct MakeNoteInput {
    notes: String,
    tags: String,
    title: String,
    url: String,
}

#[derive(Serialize)]
struct MakeNoteResponse {
    id: String,
}

#[tokio::main]
async fn main() {
    let app = Router::new()
        .route("/", get(serve_home_page))
        .route("/api/make-note", post(handle_make_note));
    let listener = tokio::net::TcpListener::bind("0.0.0.0:4545").await.unwrap();
    axum::serve(listener, app).await.unwrap();
}

async fn serve_home_page() -> response::Html<&'static str> {
    let response = include_str!("files/index.html");
    response::Html(response)
}

async fn handle_make_note(
    extract::Json(payload): extract::Json<MakeNoteInput>,
) -> response::Json<MakeNoteResponse> {
    dbg!(&payload);
    let response = MakeNoteResponse {
        id: "asdf".to_string(),
    };
    response::Json(response)
}

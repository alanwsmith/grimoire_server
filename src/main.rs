#![allow(unused)]
use anyhow::Result;
use axum::{Router, extract, response, routing::get, routing::post};
use chrono::Local;
use minijinja::Value;
use minijinja::syntax::SyntaxConfig;
use minijinja::{Environment, context};
use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;
use uuid::Uuid;

#[derive(Deserialize, Debug, Serialize)]
struct MakeNoteInput {
    notes: Option<String>,
    tags: String,
    title: Option<String>,
    url: String,
    kind: String,
    date: Option<String>,
    id: Option<String>,
}

#[derive(Serialize)]
struct MakeNoteResponse {
    id: String,
    url: String,
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
    extract::Json(mut payload): extract::Json<MakeNoteInput>,
) -> response::Json<MakeNoteResponse> {
    let now = Local::now();
    payload.date = Some(now.to_rfc3339_opts(chrono::SecondsFormat::Secs, true));
    let id = generate_id();
    payload.id = Some(id.clone());
    let _ = make_file(&payload);
    let response = MakeNoteResponse {
        id,
        url: payload.url,
    };
    response::Json(response)
}

fn generate_id() -> String {
    let mut base = Uuid::new_v4().simple().to_string();
    let id = format!(
        "{}{}/{}{}/{}{}/{}{}",
        base.remove(0),
        base.remove(0),
        base.remove(0),
        base.remove(0),
        base.remove(0),
        base.remove(0),
        base.remove(0),
        base.remove(0),
    );
    id
}

fn generate_output(payload: &MakeNoteInput) -> Result<String> {
    let mut env = Environment::new();
    env.set_syntax(
        SyntaxConfig::builder()
            .block_delimiters("[!", "!]")
            .variable_delimiters("[@", "@]")
            .comment_delimiters("[#", "#]")
            .build()
            .unwrap(),
    );
    env.add_template("bookmark", include_str!("templates/bookmark.neoj"))
        .unwrap();
    let skeleton = env.get_template("bookmark").unwrap();
    let output = skeleton
        .render(context!(payload => Value::from_serialize(payload)))
        .unwrap();
    Ok(output)
}

fn make_file(payload: &MakeNoteInput) -> Result<()> {
    let output = generate_output(payload)?;
    let grimiore_root = PathBuf::from("/Users/alan/GrimoireV2-Dev");
    let file_dir = grimiore_root.join(payload.id.as_ref().unwrap());
    let file_path = file_dir.join("source.neo");
    write_file_with_mkdir(&file_path, &output);
    Ok(())
}

fn write_file_with_mkdir(path: &PathBuf, content: &str) -> Result<(), String> {
    match path.parent() {
        Some(parent_dir) => match fs::create_dir_all(parent_dir) {
            Ok(_) => match fs::write(path, content) {
                Ok(_) => Ok(()),
                Err(e) => Err(e.to_string()),
            },
            Err(e) => Err(e.to_string()),
        },
        None => Err("Could not make directory".to_string()),
    }
}

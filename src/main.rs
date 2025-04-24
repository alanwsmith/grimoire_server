#![allow(unused)]
use anyhow::Result;
use axum::{Router, extract, response, routing::get, routing::post};
use minijinja::Value;
use minijinja::syntax::SyntaxConfig;
use minijinja::{Environment, context};
use serde::{Deserialize, Serialize};
use std::path::PathBuf;
use uuid::Uuid;

#[derive(Deserialize, Debug, Serialize)]
struct MakeNoteInput {
    notes: Option<String>,
    tags: Option<String>,
    title: String,
    url: String,
    kind: String,
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
    extract::Json(payload): extract::Json<MakeNoteInput>,
) -> response::Json<MakeNoteResponse> {
    // dbg!(&payload);
    let _ = make_file(&payload);
    //    let _ = generate_output(&payload);

    // let grimiore_root = PathBuf::from("/Users/alan/GrimoireV2");

    // let file_dir = grimiore_root.join(&id);
    // let file_path = file_dir.join("source.neo");
    // let _ = mkdir_p(&file_dir);

    // match env.get_template("hello") {
    //     Ok(template) => match template.render(context!(name => "World")) {
    //         Ok(output) => {
    //             println!("{}", output);
    //         }
    //         Err(e) => {
    //             dbg!(e);
    //             ()
    //         }
    //     },
    //     Err(e) => {
    //         dbg!(e);
    //         ()
    //     }
    // }

    // dbg!(&payload.notes);
    // dbg!(&payload.tags);
    // dbg!(&payload.title);
    // dbg!(&payload.url);

    let response = MakeNoteResponse {
        id: "asdf".to_string(),
        url: payload.url.clone(),
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
    let id = generate_id();
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
    dbg!(&output);
    Ok(())
}

fn mkdir_p(dir: &PathBuf) -> Result<()> {
    if dir.exists() {
        Ok(())
    } else {
        std::fs::create_dir_all(dir)?;
        Ok(())
    }
}

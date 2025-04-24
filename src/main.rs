#![allow(unused)]
use anyhow::Result;
use axum::{Router, extract, response, routing::get, routing::post};
use chrono::Local;
use grimoire_server::bookmark::*;
use minijinja::Value;
use minijinja::syntax::SyntaxConfig;
use minijinja::{Environment, context};
use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;
use uuid::Uuid;

#[tokio::main]
async fn main() {
    let app = Router::new()
        .route("/", get(serve_home_page))
        .route("/api/make-bookmark", post(make_bookmark));
    let listener = tokio::net::TcpListener::bind("0.0.0.0:4545").await.unwrap();
    axum::serve(listener, app).await.unwrap();
}

async fn serve_home_page() -> response::Html<&'static str> {
    let response = include_str!("files/index.html");
    response::Html(response)
}

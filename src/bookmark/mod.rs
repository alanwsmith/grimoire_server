#![allow(unused)]
use crate::file_response::FileResponse;
use crate::file_type::FileType;
use crate::helpers::*;
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

#[derive(Debug, Deserialize, Clone, Serialize)]
pub struct Bookmark {
    pub date: Option<String>,
    pub id: Option<String>,
    pub notes: Option<String>,
    pub password: String,
    pub tags: Option<String>,
    pub template: Option<String>,
    pub title: Option<String>,
    pub url: String,
}

pub async fn make_bookmark(
    extract::Json(mut payload): extract::Json<Bookmark>,
) -> response::Json<FileResponse> {
    dbg!(&payload);
    payload.id = generate_id();
    payload.date = get_date();
    payload.template = Some(include_str!("template.neoj").to_string());
    let enum_payload = FileType::Bookmark(payload.clone());
    let output = generate_output(&enum_payload);
    if let Ok(text) = output {
        dbg!(text);
    }
    let response = FileResponse {
        id: payload.id,
        url: Some(payload.url),
    };
    response::Json(response)
}

// fn make_file(payload: &Bookmark) -> Result<()> {
//     let output = generate_output(payload)?;
//     let grimiore_root = PathBuf::from("/Users/alan/GrimoireV2-Dev");
//     let file_dir = grimiore_root.join(payload.id.as_ref().unwrap());
//     let file_path = file_dir.join("source.neo");
//     write_file_with_mkdir(&file_path, &output);
//     Ok(())
// }

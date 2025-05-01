#![allow(unused)]
use crate::file_type::FileType;
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

pub fn generate_id() -> Option<String> {
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
    Some(id)
}

pub fn generate_output(payload: &FileType) -> Result<String> {
    let mut env = Environment::new();
    env.set_syntax(
        SyntaxConfig::builder()
            .block_delimiters("[!", "!]")
            .variable_delimiters("[@", "@]")
            .comment_delimiters("[#", "#]")
            .build()
            .unwrap(),
    );
    let data = match payload {
        FileType::Bookmark(b) => b,
    };
    env.add_template("note", data.template.as_ref().unwrap());
    let skeleton = env.get_template("note").unwrap();
    let output = skeleton
        .render(context!(data => Value::from_serialize(data)))
        .unwrap();
    Ok(output)
}

pub fn get_date() -> Option<String> {
    let now = Local::now();
    Some(now.to_rfc3339_opts(chrono::SecondsFormat::Secs, true))
}

pub fn get_output_root() -> PathBuf {
    PathBuf::from("/Users/alan/GrimoireV2-Dev/notes")
}

pub fn write_file_with_mkdir(path: &PathBuf, content: &str) -> Result<(), String> {
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

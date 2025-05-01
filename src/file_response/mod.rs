#![allow(unused)]
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

#[derive(Deserialize, Debug, Serialize)]
pub struct FileResponse {
    pub id: Option<String>,
    pub url: Option<String>,
}

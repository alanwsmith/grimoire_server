use axum::{Router, response::Html, routing::get};
use axum_embed::{FallbackBehavior, ServeEmbed};
use rust_embed::RustEmbed;

#[derive(RustEmbed, Clone)]
#[folder = "src/assets"]
struct Assets;

#[tokio::main]
async fn main() {
    let app = Router::new().route("/", get(serve_home_page)).nest_service(
        "/assets",
        ServeEmbed::<Assets>::with_parameters(None, FallbackBehavior::NotFound, None),
    );
    let listener = tokio::net::TcpListener::bind("0.0.0.0:4545").await.unwrap();
    axum::serve(listener, app).await.unwrap();
}

async fn serve_home_page() -> Html<&'static str> {
    let response = r#"<!DOCTYPE html>
<html>
    <body>
        <h1>Grimoire Server</h1>
        <p>
            Used to accept incoming 
            transmissions for the grimoire
        </p>
    </body>
</html>"#;
    Html(response)
}

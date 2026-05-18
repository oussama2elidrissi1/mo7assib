def test_login_valid(client, admin_user):
    resp = client.post("/auth/login", json={"email": "admin@test.com", "password": "password123", "tenant_slug": "test"})
    assert resp.status_code == 200
    data = resp.json()
    assert "access_token" in data
    assert data["user"]["email"] == "admin@test.com"


def test_login_invalid_password(client, admin_user):
    resp = client.post("/auth/login", json={"email": "admin@test.com", "password": "wrong", "tenant_slug": "test"})
    assert resp.status_code == 401


def test_login_unknown_email(client):
    resp = client.post("/auth/login", json={"email": "nobody@test.com", "password": "x", "tenant_slug": "test"})
    assert resp.status_code == 401


def test_protected_without_token(client):
    resp = client.get("/projects")
    assert resp.status_code == 403  # HTTPBearer returns 403 when no credentials


def test_me(client, auth_headers):
    resp = client.get("/auth/me", headers=auth_headers)
    assert resp.status_code == 200
    assert resp.json()["email"] == "admin@test.com"

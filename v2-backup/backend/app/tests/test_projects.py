def _create_project(client, headers):
    return client.post("/projects", json={
        "name": "Chantier Test",
        "client_type": "private",
        "location": "Casablanca",
        "project_type": "labor_only",
        "status": "active",
        "agreed_price": "500000.00",
    }, headers=headers)


def test_create_project(client, auth_headers):
    resp = _create_project(client, auth_headers)
    assert resp.status_code == 201
    assert resp.json()["name"] == "Chantier Test"


def test_get_project_not_found(client, auth_headers):
    resp = client.get("/projects/9999", headers=auth_headers)
    assert resp.status_code == 404


def test_progress_no_tasks(client, auth_headers):
    proj = _create_project(client, auth_headers).json()
    resp = client.get(f"/projects/{proj['id']}/progress", headers=auth_headers)
    assert resp.status_code == 200
    data = resp.json()
    assert data["progress_percentage"] == 0
    assert data["total_tasks"] == 0


def test_progress_with_tasks(client, auth_headers):
    proj = _create_project(client, auth_headers).json()
    pid = proj["id"]
    # Create 2 tasks
    client.post("/tasks", json={"project_id": pid, "title": "T1", "status": "done", "category": "other", "priority": "low"}, headers=auth_headers)
    client.post("/tasks", json={"project_id": pid, "title": "T2", "status": "todo", "category": "other", "priority": "low"}, headers=auth_headers)
    resp = client.get(f"/projects/{pid}/progress", headers=auth_headers)
    data = resp.json()
    assert data["total_tasks"] == 2
    assert data["completed_tasks"] == 1
    assert data["progress_percentage"] == 50.0


def test_financial_summary(client, auth_headers):
    proj = _create_project(client, auth_headers).json()
    pid = proj["id"]
    client.post("/expenses", json={
        "project_id": pid,
        "category": "materials",
        "title": "Ciment",
        "amount": "10000.00",
        "expense_date": "2024-01-15",
        "payment_method": "cash",
    }, headers=auth_headers)
    resp = client.get(f"/projects/{pid}/financial-summary", headers=auth_headers)
    assert resp.status_code == 200
    data = resp.json()
    assert float(data["manual_expenses"]) == 10000.0
    assert float(data["agreed_price"]) == 500000.0
    assert float(data["estimated_margin"]) == 490000.0

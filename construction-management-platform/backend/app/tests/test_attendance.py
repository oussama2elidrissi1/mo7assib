def _setup(client, headers):
    proj = client.post("/projects", json={
        "name": "P",
        "client_type": "private",
        "location": "Rabat",
        "project_type": "labor_only",
    }, headers=headers).json()
    emp = client.post("/employees", json={
        "project_id": proj["id"],
        "name": "Ali",
        "role": "worker",
        "daily_salary": "150.00",
    }, headers=headers).json()
    return proj["id"], emp["id"]


def test_checkin(client, auth_headers):
    pid, eid = _setup(client, auth_headers)
    resp = client.post("/attendance/check-in", json={
        "employee_id": eid,
        "project_id": pid,
        "date": "2024-02-01",
        "check_in": "08:00:00",
    }, headers=auth_headers)
    assert resp.status_code == 201


def test_duplicate_attendance(client, auth_headers):
    pid, eid = _setup(client, auth_headers)
    payload = {"employee_id": eid, "project_id": pid, "date": "2024-02-02", "check_in": "08:00:00"}
    client.post("/attendance/check-in", json=payload, headers=auth_headers)
    resp = client.post("/attendance/check-in", json=payload, headers=auth_headers)
    assert resp.status_code == 409


def test_checkout_before_checkin(client, auth_headers):
    pid, eid = _setup(client, auth_headers)
    att = client.post("/attendance/check-in", json={
        "employee_id": eid, "project_id": pid, "date": "2024-02-03", "check_in": "09:00:00",
    }, headers=auth_headers).json()
    resp = client.put(f"/attendance/{att['id']}/checkout", json={"check_out": "07:00:00"}, headers=auth_headers)
    assert resp.status_code == 400

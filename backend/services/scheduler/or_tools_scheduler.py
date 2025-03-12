from ortools.linear_solver import pywraplp
import json
import sys

def run_scheduling(existing_sessions, new_session):
    solver = pywraplp.Solver.CreateSolver('CBC')

    if not solver:
        sys.stdout.write(json.dumps({"error": "Solver initialization failed"}) + "\n")
        return

    # Constraint: Max 4 sessions per slot
    if len(existing_sessions) >= 4:
        sys.stdout.write(json.dumps({"error": "Time slot already full"}) + "\n")
        return

    # Constraint: Only 1 drum session per slot
    if new_session["instrument_id"] == "Drums":
        for session in existing_sessions:
            if session["instrument_id"] == "Drums":
                sys.stdout.write(json.dumps({"error": "Only 1 drum session allowed per time slot"}) + "\n")
                return

    # Solve the optimization problem
    status = solver.Solve()

    if status == pywraplp.Solver.OPTIMAL:
        sys.stdout.write(json.dumps({"success": True, "scheduled_session": new_session}) + "\n")
    else:
        sys.stdout.write(json.dumps({"error": "No valid schedule found"}) + "\n")

if __name__ == "__main__":
    try:
        input_data = json.loads(sys.stdin.read().strip())
        existing_sessions = input_data.get("existing_sessions", [])
        new_session = input_data.get("new_session", {})

        run_scheduling(existing_sessions, new_session)
    except json.JSONDecodeError:
        sys.stdout.write(json.dumps({"error": "Invalid JSON input"}) + "\n")

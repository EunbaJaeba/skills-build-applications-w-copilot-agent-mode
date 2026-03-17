from django.test import TestCase
from rest_framework.test import APIClient

from .models import Activity, Leaderboard, Team, User, Workout


class OctofitCollectionsTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.team = Team.objects.create(name='test team')
        self.user = User.objects.create(name='Test Hero', email='hero@test.com', team=self.team)
        self.activity = Activity.objects.create(
            user=self.user,
            activity_type='Running',
            duration_minutes=30,
            calories_burned=300,
        )
        self.leaderboard = Leaderboard.objects.create(user=self.user, points=1000)
        self.workout = Workout.objects.create(
            user=self.user,
            title='Hero Circuit',
            focus='Full Body',
            difficulty='Intermediate',
        )

    def test_expected_db_tables(self):
        self.assertEqual(Team._meta.db_table, 'teams')
        self.assertEqual(User._meta.db_table, 'users')
        self.assertEqual(Activity._meta.db_table, 'activities')
        self.assertEqual(Leaderboard._meta.db_table, 'leaderboard')
        self.assertEqual(Workout._meta.db_table, 'workouts')

    def test_users_endpoint(self):
        response = self.client.get('/api/users/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()), 1)

    def test_teams_endpoint(self):
        response = self.client.get('/api/teams/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()), 1)

    def test_activities_endpoint(self):
        response = self.client.get('/api/activities/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()), 1)

    def test_leaderboard_endpoint(self):
        response = self.client.get('/api/leaderboard/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()), 1)

    def test_workouts_endpoint(self):
        response = self.client.get('/api/workouts/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()), 1)

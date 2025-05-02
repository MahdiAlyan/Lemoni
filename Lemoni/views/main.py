from django.shortcuts import render
from django.contrib import admin
from django.core.files import images
from django.urls import path, include
from django.conf import settings


def home(request):
    return render(request, 'main/dashboard.html')


def about(request):
    return render(request, 'main/about.html')


def dashboard(request):
    return render(request, 'main/dashboard.html')


urlpatterns = [
    path('home/', home, name='dashboard'),
    path('about/', about, name='about'),
    path('dashoard/', dashboard, name='dashboard'),
]

from django.http import JsonResponse
from Lemoni.models import Images
from django.core.paginator import Paginator
from django.urls import path
from django.shortcuts import render


def images_dashboard(request):
    return render(request, 'images/media_dashboard.html')


def images_data(request):
    draw = int(request.GET.get('draw', 1))
    start = int(request.GET.get('start', 0))
    length = int(request.GET.get('length', 10))
    search_value = request.GET.get('search[value]', '')

    images = Images.objects.all()

    if search_value:
        images = images.filter(description__icontains=search_value)

    total = images.count()
    images = images[start:start+length]

    data = []
    for image in images:
        data.append({
            'image': f'<img src="{image.image_file.url}" width="50">',
            'id': image.id,
            'uploaded_at': image.uploaded_at.strftime('%Y-%m-%d %H:%M'),
            'processed': str(image.processed),
            'result': image.result,
            'description': image.description,
            'path': image.image_file.url,
            'capture_date': image.capture_date.strftime('%Y-%m-%d') if image.capture_date else '',
            'location': image.location,
            'resolution': image.resolution,
        })

    return JsonResponse({
        'draw': draw,
        'recordsTotal': Images.objects.count(),
        'recordsFiltered': total,
        'data': data
    })


def upload_images(request):
    if request.method == 'POST' and request.FILES.get('file'):
        file = request.FILES.get('file')
        image = Images(image_file=file)
        image.save()
        return JsonResponse({'message': 'Images uploaded successfully'})
    return JsonResponse({'error': 'Invalid request'}, status=400)


urlpatterns = [
    path('dashboard', images_dashboard, name='images_dashboard'),
    path('data', images_data, name='images_data'),
    path('upload', upload_images, name='upload_images'),
]

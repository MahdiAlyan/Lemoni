from django.http import JsonResponse
from Lemoni.models import Images
from django.urls import path
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from django.db.models.query import Q


def images_dashboard(request):
    return render(request, 'Images/media_dashboard.html')


def images_data(request):

    qset = Q(is_deleted=False)
    search_filter = request.GET.get('search[value]', '')  # Get the search query

    if search_filter:
        # Filter images based on the search query
        search_qset = Q(
            Q(name__icontains=search_filter) |
            Q(description__icontains=search_filter) |
            Q(uploaded_at__icontains=search_filter) |
            Q(capture_date__icontains=search_filter) |
            Q(id__icontains=search_filter) |
            Q(location__icontains=search_filter) |
            Q(result__icontains=search_filter) |
            Q(processed__icontains=search_filter)
        )
        qset &= Q(search_qset)

    data = []
    total_record = 0

    start = int(request.GET.get('start'))
    length = int(request.GET.get('length'))

    images_queryset_list = Images.objects.filter(qset)
    total_record = images_queryset_list.count()

    images_list = images_queryset_list[start:start + length]

    for image in images_list:
        image_dto = {
            'image_file': request.build_absolute_uri(image.image_file.url),
            'id': image.id,
            'uploaded_at': image.uploaded_at,
            'processed': image.processed,
            'result': image.result,
            'description': image.description,
            'path': image.image_file.name,
            'capture_date': image.capture_date,
            'location': image.location(),
            'resolution': image.resolution(),
        }
        data.append(image_dto)

    draw = request.GET.get('draw')
    result = {
        "draw": draw,
        "recordsTotal": total_record,
        "recordsFiltered": total_record,
        "data": data
    }

    return tools.ajax({'data': data})


@csrf_exempt
@require_POST
def upload_images(request):
    image_file = request.FILES.get('file')  # Get the uploaded file
    if image_file:
        # Save the image to the database
        image = Images.objects.create(image_file=image_file)
        return JsonResponse({'message': 'Image uploaded successfully!', 'id': image.id})
    return JsonResponse({'error': 'No file uploaded'}, status=400)


urlpatterns = [
    path('dashboard/', images_dashboard, name='images_dashboard'),
    path('images_data/', images_data, name='images_data'),
    path('upload/', upload_images, name='upload_images'),
]

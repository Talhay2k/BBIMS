<?php

use App\Http\Controllers\BloodBankApiController;
use Illuminate\Support\Facades\Route;

Route::get('/inventory', [BloodBankApiController::class, 'getInventory']);
Route::post('/inventory', [BloodBankApiController::class, 'storeInventory']);
Route::put('/inventory/{id}', [BloodBankApiController::class, 'updateInventory']);
Route::put('/inventory/{id}/status', [BloodBankApiController::class, 'updateInventoryStatus']);
Route::delete('/inventory/{id}', [BloodBankApiController::class, 'destroyInventory']);

Route::get('/donors', [BloodBankApiController::class, 'getDonors']);
Route::post('/donors', [BloodBankApiController::class, 'storeDonor']);
Route::put('/donors/{id}', [BloodBankApiController::class, 'updateDonor']);
Route::delete('/donors/{id}', [BloodBankApiController::class, 'destroyDonor']);
Route::post('/donors/{id}/record-donation', [BloodBankApiController::class, 'recordDonation']);

Route::get('/requests', [BloodBankApiController::class, 'getRequests']);
Route::post('/requests', [BloodBankApiController::class, 'storeRequest']);
Route::put('/requests/{id}', [BloodBankApiController::class, 'updateRequest']);
Route::delete('/requests/{id}', [BloodBankApiController::class, 'destroyRequest']);
Route::post('/requests/{id}/cross-match', [BloodBankApiController::class, 'crossMatch']);
Route::post('/requests/{id}/dispatch', [BloodBankApiController::class, 'dispatchOrder']);

Route::get('/drives', [BloodBankApiController::class, 'getDrives']);
Route::post('/drives', [BloodBankApiController::class, 'storeDrive']);
Route::put('/drives/{id}', [BloodBankApiController::class, 'updateDrive']);
Route::delete('/drives/{id}', [BloodBankApiController::class, 'destroyDrive']);

Route::get('/facilities', [BloodBankApiController::class, 'getFacilities']);
Route::get('/facilities/equipment', [BloodBankApiController::class, 'getEquipment']);

Route::get('/compliance/audit-logs', [BloodBankApiController::class, 'getAuditLogs']);
Route::get('/compliance/discard-logs', [BloodBankApiController::class, 'getDiscardLogs']);

Route::get('/ai-forecast', [BloodBankApiController::class, 'getAiForecast']);

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('facilities', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('code')->unique();
            $table->string('name');
            $table->string('type');
            $table->string('city');
            $table->string('phone');
            $table->integer('refrigerators_count')->default(0);
            $table->integer('freezers_count')->default(0);
            $table->integer('agitators_count')->default(0);
            $table->string('status')->default('Operational');
            $table->integer('total_units_in_stock')->default(0);
            $table->integer('available_units')->default(0);
            $table->timestamps();
        });

        Schema::create('storage_equipments', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('facility_id');
            $table->string('name');
            $table->string('type');
            $table->float('current_temp_c')->default(4.0);
            $table->float('target_temp_c')->default(4.0);
            $table->string('status')->default('Normal');
            $table->integer('capacity_units')->default(100);
            $table->integer('occupied_units')->default(0);
            $table->timestamps();
        });

        Schema::create('donors', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('donor_code')->unique();
            $table->string('full_name');
            $table->string('blood_type');
            $table->integer('age');
            $table->string('gender');
            $table->string('phone');
            $table->string('email');
            $table->string('address')->nullable();
            $table->string('last_donation_date')->nullable();
            $table->string('eligibility_status')->default('Eligible');
            $table->string('deferral_reason')->nullable();
            $table->integer('total_donations_count')->default(0);
            $table->float('hemoglobin_gdl')->default(14.0);
            $table->string('blood_pressure')->default('120/80');
            $table->float('weight_kg')->default(70.0);
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        Schema::create('blood_units', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('unit_number')->unique();
            $table->string('blood_type');
            $table->string('component');
            $table->string('facility_id')->nullable();
            $table->string('facility_name')->nullable();
            $table->string('location')->nullable();
            $table->string('temperature_zone')->nullable();
            $table->integer('volume_ml')->default(450);
            $table->string('collection_date');
            $table->string('expiry_date');
            $table->string('status')->default('Available');
            $table->string('donor_id')->nullable();
            $table->string('donor_code')->nullable();
            $table->string('testing_status')->default('Tested & Passed');
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        Schema::create('blood_requests', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('request_code')->unique();
            $table->string('hospital_name');
            $table->string('patient_name');
            $table->integer('patient_age');
            $table->string('patient_gender');
            $table->string('required_blood_type');
            $table->string('component');
            $table->integer('units_requested')->default(1);
            $table->json('units_assigned')->nullable();
            $table->string('urgency')->default('Routine');
            $table->string('status')->default('Pending');
            $table->string('request_date');
            $table->string('required_by_date');
            $table->float('dispatch_temperature_c')->nullable();
            $table->string('courier_tracking_code')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        Schema::create('donation_drives', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('drive_code')->unique();
            $table->string('name');
            $table->string('organizer');
            $table->string('location');
            $table->string('start_date');
            $table->string('end_date');
            $table->integer('target_units')->default(100);
            $table->integer('collected_units')->default(0);
            $table->integer('registered_donors_count')->default(0);
            $table->string('status')->default('Active');
            $table->string('facility_id')->nullable();
            $table->timestamps();
        });

        Schema::create('audit_logs', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('timestamp');
            $table->string('user_staff');
            $table->string('action');
            $table->string('entity_type');
            $table->string('entity_id');
            $table->text('details');
            $table->string('digital_signature_hash');
            $table->timestamps();
        });

        Schema::create('discard_logs', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('unit_number');
            $table->string('blood_type');
            $table->string('component');
            $table->string('discard_date');
            $table->string('reason');
            $table->string('performed_by');
            $table->string('facility_name');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('discard_logs');
        Schema::dropIfExists('audit_logs');
        Schema::dropIfExists('donation_drives');
        Schema::dropIfExists('blood_requests');
        Schema::dropIfExists('blood_units');
        Schema::dropIfExists('donors');
        Schema::dropIfExists('storage_equipments');
        Schema::dropIfExists('facilities');
    }
};

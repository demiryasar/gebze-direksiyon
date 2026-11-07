<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('hero') && !Schema::hasColumn('hero', 'mobile_background_image')) {
            Schema::table('hero', function (Blueprint $table) {
                $table->string('mobile_background_image')->nullable()->after('background_image');
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasTable('hero') && Schema::hasColumn('hero', 'mobile_background_image')) {
            Schema::table('hero', function (Blueprint $table) {
                $table->dropColumn('mobile_background_image');
            });
        }
    }
};
